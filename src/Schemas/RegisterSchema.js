import mongoose, { Schema } from "mongoose";


const RegisterSchema=new mongoose.Schema({
    fullname:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    number:{type:Number,required:true,unique:true},
    password:{type:String,required:true},
},{ timestamps: true })

export default mongoose.model("RegisterSchema",RegisterSchema);