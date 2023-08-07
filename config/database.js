import mongoose from "mongoose";
import logger from "../log/logger.js"

const connectDB = async() => {
    try{
       const db =  await mongoose
       .connect(process.env.DB)
       .then(logger.info("Successfully connected to MongoDB"));

       return db;
    }catch(err){
        logger.warn(err.message);
        process.exit(-1)
    }
};
export default connectDB;
