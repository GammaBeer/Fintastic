import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import 'dotenv/config';
import userRouter from "./routes/userRoute.js";
const port =process.env.PORT || 5000;

const app = express(); 

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

connectDB();

app.use("/api/user", userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    
});




