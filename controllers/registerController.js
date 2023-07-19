import { gCode } from "../config/generateToken.js";
import UsernameGenerator from "username-generator";
import logger from "../log/logger.js";
import User from "../models/User.js";
import { ReturnDocument } from "mongodb";
const registerController = {
  validationOTP: (req,res,next) => {
    const phoneNo = req.body.phoneNo;
    logger.info(phoneNo)
    const generatedCode = gCode();
    res.status(201).json({code:generatedCode});
  },
  createUser:async(req,res,next) =>{
    const {phoneNo, password} = req.body;
    const userName = UsernameGenerator.generateUsername("_");
    const isUser = await User.findOne({phone:phoneNo});
    if (isUser){
        res.json({
                code:401,
                message:"user already exit"})
        return;
    };
    const userData = new User({
        name:userName,
        phone:phoneNo,
        password:password,
    });
    await userData.save();
    res.json({code:201,message:"account created"})
  }
};
export default registerController;