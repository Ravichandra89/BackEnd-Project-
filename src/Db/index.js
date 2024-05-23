import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


const connectDB = async () => {
  try {
    // Holding Response after the connection is stablished

    const connnectionResponse = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)

    console.log(`MongoDb Connected !! DB HOST: ${connnectionResponse.connection.host}`);
  } catch (error) {
    console.log("MongoDB Connection error",error);
    process.exit(1)
  }
};

export default connectDB;