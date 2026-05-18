import mongoose, { Schema } from 'mongoose';

const pollsSchema=new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String},
    options:[
        {
            text:{type:String,required:true},
            vote:{type:Number,default:0}
        }
    ],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"RegisterSchema"
    },
},{timestamps:true});

export default mongoose.model("pollsSchema",pollsSchema);
