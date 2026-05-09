import jwt from 'jsonwebtoken';
import RegisterSchema from '../Schemas/RegisterSchema.js';
export const security=async(req,res,next)=>{
    try {
        const tocken=req.headers.authorization
        console.log("this is fronted access_tocken sendend to backend",req.headers.authorization);
        if(!tocken){
            return res.send({success:false,message:"Token not available"});
        }
        const decodeToken=jwt.verify(tocken,process.env.SECKET_KEY);
        
        const user=await RegisterSchema.findOne(decodeToken.email);
        console.log(user);

       if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        next();
        
    } catch (error) {
        return res.send({message:"catch error",success:false,message:error.message});
        
    }
}
