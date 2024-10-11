import express from "express";

import { loginUser,registerUser} from "../controllers/userController.js";
import {getWatchlist,addToWatchlist,removeFromWatchlist,checkSymbolInWatchlist} from "../controllers/watchlistController.js";

const userRouter = express.Router();

userRouter.post("/login",loginUser);
userRouter.post("/register",registerUser);
userRouter.post("/getWatchlist",getWatchlist);
userRouter.post("/addToWatchlist",addToWatchlist);
userRouter.post("/removeFromWatchlist",removeFromWatchlist);
userRouter.post("/CheckInWatchlist",checkSymbolInWatchlist);

export default userRouter;