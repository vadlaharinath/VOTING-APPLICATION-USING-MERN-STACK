
// //Register(create account)
// //login
// //get account using id
// //generate account

// import RegisterSchema from "../Schemas/RegisterSchema";

// const createUser=async(req,res)=>{
//     const{fullname,email,number,password}=req.body;

//     if(!fullname || !email || !number || !password||password.length<6){
//         res.status(400).send({success:false,message:"all fields are require"});
//     }
//     const userExists=await RegisterSchema.findOne({email});

//     if(userExists){
//          res.status(400).send({success:false,message:"User Already exist"});
//     }
//     const hashpassword=

// }