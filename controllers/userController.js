const User = require("../models/User.js");
const asyncHandler = require('express-async-handler');
const generateToken = require("../config/generateToken.js");

exports.authUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if (user &&(await user.matchPassword(password))) {
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            image:user.image,
            chips:user.chips,
            token:generateToken(user._id),
        })
    } else {
        res.status(401);
        throw new Error("invalid Email or Password");
    }
})
