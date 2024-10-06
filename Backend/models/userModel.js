import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    watchList:[
        {
            type:String //Store Crypto Symbol
        }
    ]
});

const userModel=mongoose.model.userModel || mongoose.model("userModel",userSchema);
export default userModel;