import express from 'express';
import mongoose, { Schema } from 'mongoose';
import database from './src/config/database.js';
import RegisterSchema from './src/Schemas/RegisterSchema.js';
import  { security } from './src/middleware/auth.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const app = express();
app.use(express.json());
await database();

const payload = {
    RegisterSchema: {
        email: RegisterSchema.email,
        username: RegisterSchema.username
    }
}

const token = jwt.sign(
    payload,
    process.env.SECKET_KEY,
    { expiresIn: '2h' }

)

app.get("/login", (req, res) => {
    res.send("jai balayya this is login page");

});

app.post("/register", async (req, res) => {
    try {
        const { fullname, email, number, password } = req.body;
        console.log(fullname, email, number, password);

        if (!fullname || !email || !number || !password || password.length < 4) {
            return res.status(400).json({ success: false, message: "all fields are require" });
        }

        //if user exit in data
        const userExists = await RegisterSchema.findOne({ email });
        if (userExists) {
            return res.send({ success: false, message: "user already exist" })
        }

        //insert data
        const hashPassword = await bcrypt.hash(password, 10);
        const createUser = await RegisterSchema.create({ fullname, email, number, password: hashPassword, });

        if (createUser) {
            return res.status(201).json({ "access_token": token, message: "user created successfully" });
        }


    } catch (error) {
        console.log("error", error.message);

    }

});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        if (!email || !password) {
        return res.status(400).json({ success: false, message: "all fields are require" });
    }
    const databaseUser = await RegisterSchema.findOne({ email });

    if (!databaseUser) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatched = await bcrypt.compare(password, databaseUser.password);

    if(isMatched){
        return res.status(200).json({"access_token": token, message:"login successufully" });
    }else{
        return res.status(401).json({message: "Invalid password"});
    }
        
    } catch (error) {
        console.log("error",error.message);
        
    }

    


})

app.get("/me",security,async(req,res)=>{
    try {
       const {RegisterSchema}=req;
        res.send({success:true,RegisterSchema})
    } catch (error) {
        res.send({message:"function security error",success:false,message:error.message});   
    }
});

const PORT = 5000;
app.listen(PORT, (req, res) => {
    console.log(`server running on ${PORT}`);
});