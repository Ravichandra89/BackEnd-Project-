import mongoose from "mongoose";
import connectDB from "./Db/index.js";
import dotenv from 'dotenv'
import { app } from "./app.js";

dotenv.config({
    path: './env'
})

// Calling the connectDB
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`)
    })
})
.catch((error) => {
    console.log("MongoDb connection failed !!",error);
})