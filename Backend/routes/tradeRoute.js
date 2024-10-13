import express from "express";
import {checkBalance,buyCoin,sellCoin,getHoldings,getTradeHistory} from "../controllers/tradeController.js";

const tradeRouter = express.Router();

tradeRouter.post("/checkBalance", checkBalance);
tradeRouter.post("/buycoin", buyCoin);
tradeRouter.post("/sellcoin", sellCoin);
tradeRouter.post("/holdings", getHoldings);
tradeRouter.post("/history", getTradeHistory);


export default tradeRouter;