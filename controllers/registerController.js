import { gCode } from "../config/generateToken.js";
import logger from "../log/logger.js";
const registerController = {
  validationOTP: (req,res,next) => {
    const phoneNo = req.body.phoneNo;
    logger.info(phoneNo)
    const generatedCode = gCode();
    res.status(201).json({code:generatedCode});
  },
};
export default registerController;