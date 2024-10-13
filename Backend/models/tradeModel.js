import mongoose from "mongoose";
const coinHoldingSchema = new mongoose.Schema({
    coinId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    }
});

const tradeHistorySchema = new mongoose.Schema({
    coinId: {
        type: String, 
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    tradeType: {
        type: String,
        enum: ['buy', 'sell'],
        required: true
    },
    tradeDate: {
        type: Date,
        default: Date.now
    }
});
const tradeModelSchema= new mongoose.Schema({
    userId: {
        type: { type: Schema.Types.ObjectId, ref: 'userModel' },
        required: true
    },
    currentHoldings: [coinHoldingSchema],
    history: [tradeHistorySchema]
});

const  tradeModel=mongoose.model.tradeModel || mongoose.model("tradeModel",tradeModelSchema);

export default tradeModel;