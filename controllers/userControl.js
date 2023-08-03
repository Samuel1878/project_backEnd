import { decodeToken } from "../config/generateToken.js";
import User from "../models/User.js";

const userData = {
    chip:async(req,res,next)=>{
       const token =  req.query.token;
       let  reqData = req.query?.reqData;
       const decoded = decodeToken(token);
       const data = await User.findOne({_id:decoded.id});
       console.log(data);
       function createUserData(){
        return(
            {
                name:data?.name,
                phone:data?.phone,
                chips:data?.chips,
                proSrc:data?.image,
            }
        )
       }

       if (data){
        switch (reqData) {
          case "chip":
            res.status(201).json({
              chips: data.chips,
            });
            break;
          case "allData":
            res.status(201).json({
                data: createUserData()
            })
            break;
          case "friendList":
            res.status(201).json({
                friendList: data.friendList
            })

          default:
            break;
        }
        return
       }
       res.status(401).json({
        message:"Not authenticated"
       })

    },
    profileData:(req,res,next)=>{

    },
}
export default userData