const mongoose = require("mongoose");
const logger = require("../log/logger");

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.DB, {
            useNewUrlParse:true,
            useUnifiedTopology:true,
            userCreateIndex:true,
        }).then(logger.info("Successfully connected to MongoDB"));
    }catch(err){
        logger.warn(err.message);
        process.exit(1)
    }
};
module.exports = connectDB;
