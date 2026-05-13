import jwt from 'jsonwebtoken';
import RegisterSchema from '../Schemas/RegisterSchema.js';

export const security = async (req, res, next) => {

    try {
        const token = req.headers.authorization;
        console.log("frontend token",token);

        if (!token) {
            return res.status(401).json({success: false,message: "Token not available"});
        }

        // verify token
        const decodeToken = jwt.verify(token,process.env.SECKET_KEY);
        console.log(decodeToken, "decodeToken");

        if (!decodeToken) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        req.user =await RegisterSchema.findOne({"userDetails":decodeToken.email}).select("-password");
        // go to next route
        next();

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}