import tradeModel from "../models/tradeModel.js";

const checkBalance=async(req,res)=>{    
    const {email}=req.body;
    try {
        const trade=await tradeModel.findOne({userId:email});
        if (!trade) {
            return res.json({ success: false, message: "User not found" });
          }
        res.json({ success: true,balance : trade.balance });
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Internal server error"});
    }
}

const buyCoin=async(req,res)=>{
    const {email,coin,quantity,boughtAt,value}=req.body;
    try {
        const trade=await tradeModel.findOne({userId:email});
        if(!trade){
            return res.json({success:false,message:"User not found"});
        }
        trade.currentHoldings.push(
            {
                coinId:coin,
                quantity:quantity,
                price:boughtAt
            }
        );
        trade.history.push(
            {
                coinId:coin,
                quantity:quantity,
                price:boughtAt,
                tradeType:"buy",
                tradeDate:Date.now()
            }
        )
        trade.balance=trade.balance-value;
        await trade.save();
        res.json({success:true,message:"Coin bought successfully"});
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Internal server error"});
    }
}

const sellCoin = async (req, res) => {
    const { email, coin, quantity, soldAt, value } = req.body;
    try {
        const trade = await tradeModel.findOne({ userId: email });
        if (!trade) {
            return res.json({ success: false, message: "User not found" });
        }

        // Find all holdings of the specified coin
        const holdings = trade.currentHoldings.filter((item) => item.coinId === coin);

        // Check if there are holdings for the specified coin
        if (!holdings || holdings.length === 0) {
            return res.json({ success: false, message: "Coin not found in holdings" });
        }

        // Calculate total quantity available
        const totalQuantity = holdings.reduce((sum, holding) => sum + holding.quantity, 0);

        // Check if total quantity is sufficient
        if (totalQuantity < quantity) {
            return res.json({ success: false, message: "Not enough coins to sell" });
        }

        // Reduce quantity from holdings, using a FIFO strategy
        let remainingQuantityToSell = quantity;
        for (let holding of holdings) {
            if (remainingQuantityToSell <= 0) break;
            
            if (holding.quantity <= remainingQuantityToSell) {
                // Sell all of this holding
                remainingQuantityToSell -= holding.quantity;
                holding.quantity = 0; // Mark as fully sold
            } else {
                // Partially sell from this holding
                holding.quantity -= remainingQuantityToSell;
                remainingQuantityToSell = 0; // All required quantity has been sold
            }
        }

        // Remove holdings where quantity is zero (fully sold holdings)
        trade.currentHoldings = trade.currentHoldings.filter(holding => holding.quantity > 0);
        trade.history.push({
            coinId: coin,
            quantity: quantity,
            price: soldAt,
            tradeType: "sell",
            tradeDate: Date.now(),
        });

        trade.balance = trade.balance + value;

        await trade.save();

        res.json({ success: true, message: "Coin sold successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Internal server error" });
    }
};



const getHoldings=async(req,res)=>{
    const {email}=req.body;
    try {
        const trade=await tradeModel.findOne({userId:email});
        if (!trade) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({success:true,holdings:trade.currentHoldings});

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Internal server error"});
        
    }
}

const getTradeHistory=async(req,res)=>{
    const {email}=req.body;
    try {
        const trade=await tradeModel.findOne({userId:email});
        if (!trade) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({success:true,history:trade.history});

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Internal server error"});
        
    }
}

export {checkBalance,buyCoin,sellCoin,getHoldings,getTradeHistory};