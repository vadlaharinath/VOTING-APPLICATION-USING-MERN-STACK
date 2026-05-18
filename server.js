import express from 'express';
import mongoose, { Schema } from 'mongoose';
import database from './src/config/database.js';
import RegisterSchema from './src/Schemas/RegisterSchema.js';
import { security } from './src/middleware/auth.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import pollsSchema from './src/Schemas/pollsSchema.js';
import PollsSchema from './src/Schemas/pollsSchema.js';

import voteSchema from './src/Schemas/voteSchema.js';
import vote from './src/Schemas/voteSchema.js';
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

        if (isMatched) {
            return res.status(200).json({ "access_token": token, message: "login successufully" });
        } else {
            return res.status(401).json({ message: "Invalid password" });
        }

    } catch (error) {
        console.log("error", error.message);

    }




})

app.get("/profile", security, async (req, res) => {
    try {
        const { user } = req;
        res.json({ success: true, user });
    } catch (error) {
        res.send({ message: "function security error", success: false, message: error.message });
    }
});

app.post("/createPolls", security, async (req, res) => {

    try {
        const { title, description, options } = req.body;

        if (!title || !options || !Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const optionsFormat = options.map((option) => ({
            text: option,
            vote: 0,
        }));


        const polls = await PollsSchema.create({
            title,
            description,
            options: optionsFormat,
            author: req?.user?._id,

        })

        if (polls) {
            return res.status(201).json({ success: true, message: "polls created successfully", polls });
        }

    } catch (error) {
        res.send({ message: "polls error", success: false, message: error.message });

    }

})

//get posts from db
app.get("/polls", security, async (req, res) => {
    try {
        let { limit } = req.query;
        limit = parseInt(limit);
        if (!limit || isNaN(limit)) limit = 0;
        if (limit > 50) limit = 50;

        const posts = await PollsSchema.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("author", "fullname _id");

        //isVoted
        const postWithVote = await Promise.all(
            posts?.map(async (poll) => {
                const pollObj = poll.toObject();
                const isVoted = await getUserVoteForPoll(poll?._id, req?.user?._id);

                //total votes
                const totalVotes = pollObj.options.reduce(
                    (sum, opt) => sum + opt.vote, 0
                );

                //add vote percentage
                const optionWithPercentage = pollObj.options.map((opt) => {
                    const percentage = totalVotes > 0 ? (opt.vote / totalVotes) * 100 : 0;

                    return {
                        ...opt,
                        Percentage: Math.round(percentage)
                    };
                })
                return {
                    ...pollObj,
                    isVoted,
                    options:optionWithPercentage
                };


            })
        );
        res.json({ success: true, posts: postWithVote, totalPosts: postWithVote?.length });


    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }

});

const getUserVoteForPoll = async (pollId, userId) => {
    const isVoted = await voteSchema.findOne({poll:pollId,user:userId}).lean();
    return isVoted ? isVoted?.optionId:null;

}

app.post("/vots",async(req,res)=>{
    try {
        const{pollId,optionId}=req.body;
        const userId=req.user._id;

        const polls=await pollsSchema.find(pollId);

        if(!polls){
             return res.status(400).json({ success: false, message:"poll not found"});

        }

        const vote=voteSchema({
            poll:pollId,
            user:userId,
            optionId
        });
        vote.save();
        const UpdatePoll=await pollsSchema.findOneAndUpdate(
            {
                _id:pollId,
                "option?._id":optionId,

            },
            {$inc:{"options?.vote":1}},
            {new:true}
        );
        
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
        
    }

})






const PORT = 5000;
app.listen(PORT, (req, res) => {
    console.log(`server running on ${PORT}`);
});