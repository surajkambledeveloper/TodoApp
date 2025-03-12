const jwt=require("jsonwebtoken");
const userModel = require("../models/user.model");

const authenticate=async(req,res,next)=>{
    const token=req.cookies.jwt;
    if(!token){
        return res.status(401).json({message: "Unauthorized"})
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
        // console.log(decoded)
        req.user=await userModel.findById(decoded.userId)

    }
    catch(error){
        return res.status(401).json({error: error.message})
    }
    
next();
}

module.exports={authenticate}