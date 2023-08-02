import { decodeToken } from "../config/generateToken.js";
import User from "../models/User.js";

const userData = {
    chip:async(req,res,next)=>{
       const token =  req.query.token
       const decodedId = decodeToken(token);
       console.log(decodedId)
       const data = await User.findById(decodedId);
       if (data){
        res.status(201).json({
            chips:data.chips
        })
       }
       res.status(401).json({
        message:"Not authenticated"
       })

    },
    profileData:(req,res,next)=>{

    },
}
export default userData