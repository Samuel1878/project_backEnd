import logger from "../log/logger.js";
import User from "../models/User.js";
import generateToken from "../config/generateToken.js"

const loginController = async(req,res,next) =>{
        const {phoneNo, password} = req.body;
        const isUser = await User.findOne({phone:phoneNo});
        if (isUser && (password === isUser.password)) {
          res.json({
            _id: isUser._id,
            name: isUser.name,
            email: isUser.email,
            image: isUser.image,
            chips: isUser.chips,
            token: generateToken(isUser._id),
          });
        } else {
          res.json({code:401, message:"invalid Email or Password"});
        }
    }
export default loginController;