import mongoose, { Schema } from "mongoose";


const RegisterSchema=new Schema({
    fullname:{type:String,require:true,unique:true},
    email:{type:String,require:true,unique:true},
    number:{type:Number,require:true,unique:true},
    password:{type:String,require:true},
},{ timestamps: true })

export default mongoose.model("RegisterSchema",RegisterSchema);