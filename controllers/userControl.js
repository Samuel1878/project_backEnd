import { decodeToken } from "../config/generateToken.js";
import User from "../models/User.js";

const userData = {
    chip:async(req,res,next)=>{
       const token =  req.body.token;
       const decodedId = await decodeToken(token);
       const data = await User.findOne({_id:decodedId});
       if (data){
        res.status(201).json({
            chips:data.chips
        })
       }

    },
    profileData:(req,res,next)=>{

    },
}
export default userData