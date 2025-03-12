const jwt=require("jsonwebtoken");
const userModel = require("../models/user.model");
const  generateTokenAndSaveInCookies=async function (userId,res) {
 const token=jwt.sign(
        {userId},
        process.env.JWT_SECRET_KEY,
        {expiresIn: "10d"}
    ) 
    res.cookie("jwt",token,{
        httpOnly: true,
        secure:false,
        sameSite:"lax",
        path:"/",
        // maxAge: 10 * 24 * 60 * 60 * 1000,
    })
   await userModel.findByIdAndUpdate(userId,{token})
   return token

};


module.exports={generateTokenAndSaveInCookies}

