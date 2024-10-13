import userModel from "../models/userModel.js";
import { jwtDecode } from "jwt-decode";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator"; 


const getWatchlist = async (req, res) => {

    const {email}=req.body;
    try {
      console.log(email);
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }
      res.json({ success: true,watchlist : user.watchList });
      
    } catch (error) {
      console.log(error);
      return res.json({ success: false, message: "Internal server error" });
      
    }
    // res.send("Watchlist");

}

const addToWatchlist = async (req, res) => {
    const {email,symbol}=req.body;
    try {
      const user=await userModel.findOne({email});
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }
      if (user.watchList.includes(symbol)) {
        return res.json({ success: false, message: "Symbol already in watchlist" });
      }
      user.watchList.push(symbol);
      await user.save();
      res.json({ success: true, message: "Symbol added to watchlist",watchlist:user.watchList });
      
    } catch (error) {
      console.log(error);
      res.json({success:false,message:"Internal server error"});
    }
};

const removeFromWatchlist = async (req, res) => {
  const {email,symbol}=req.body;
  try {
    const user=await userModel.findOne({email});
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (!user.watchList.includes(symbol)) {
      return res.json({ success: false, message: "Symbol not found in watchlist" });
    }
    user.watchList = user.watchList.filter((item) => item !== symbol);
    await user.save();
    res.json({ success: true, message: "Symbol removed from watchlist", watchList: user.watchList });
    
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Internal server error"});
    
  }  
};

const checkSymbolInWatchlist = async (req, res) => {
  const { email, symbol } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.watchList.includes(symbol)) {
      return res.json({ present: true, message: "Symbol already in watchlist" });
    }
    else return res.json({ present: false, message: "Symbol not in watchlist" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Internal server error" });
  }
}



export {getWatchlist,addToWatchlist,removeFromWatchlist,checkSymbolInWatchlist};