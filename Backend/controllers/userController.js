
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator"; 

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
} 

const loginUser = async (req, res) => {
    const {email,password}=req.body;
    try {
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"User not found"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"Invalid credentials"});
        }
        const token=createToken(user._id);
        res.json({success:true,token});
        
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:"Internal server error"});
    }
}

const registerUser = async (req, res) => {
    const {name,password,email}=req.body;
    if (!name || !email || !password) {
        return res.json({ success: false, message: "All fields are required" });
    }
    try {
        const exists=await userModel.findOne({email});
        if(exists){
            return res.json({success:false,message:"User already exists"});
        }
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Invalid email"});
        }
        if(password.length<8){
            return res.json({success:false,message:"Password must be atleast 8 characters long"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedpassword=await bcrypt.hash(password,salt);

        const newUser=new userModel({
            name:name,
            email:email,
            password:hashedpassword
        });

        const user=await newUser.save()
        const token=createToken(user._id);
        res.json({success:true,token});

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Internal server error"});
    }
}

export { loginUser, registerUser };