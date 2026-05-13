import mongoose, { Schema } from "mongoose";

const voteSchema = new mongoose.Schema({
    poll: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "PollsSchema"
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "RegisterSchema"
    },
    optionId:{
        type:String,
        required:true
    }

});
voteSchema.index({user:1,poll:1},{unique:true})

const vote=mongoose.model("voteSchema",voteSchema);
export default vote;