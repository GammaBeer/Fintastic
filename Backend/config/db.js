import mongoose from "mongoose";
import 'dotenv/config';

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`)
        .then(() => console.log("DataBase Connected Successfully"))
    } catch (error) {
        console.log(error);
        
    }
};

export default connectDB;