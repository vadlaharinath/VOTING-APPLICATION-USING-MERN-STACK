import mongoose from "mongoose";
import 'dotenv/config';
const db_url = "mongodb+srv://votingsystem:votingsystem123@mernprojects.rw1lfxr.mongodb.net/";
const database=async()=>{
    try {
        await mongoose.connect(process.env.db_url);
        console.log("database connected successfully");
        
    } catch (error) {
        console.log("database connection failed",error.message);
        
    }
}
export default database;
