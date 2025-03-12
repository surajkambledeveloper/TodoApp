const userModel = require("../models/user.model")
const bcrypt=require("bcryptjs")
const {z}=require("zod");
const {  generateTokenAndSaveInCookies } = require("../jwt/token");
const userSchema = z.object({
    email: z.string().trim().email({ message: "Invalid email address" }),
    username: z.string().trim().min(3, { message: "Username must be at least 3 characters long" }),
    password: z.string().trim()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(15, { message: "Password must be at most 15 characters long" })
      .regex(/[A-Z]/, { message: " Password must contain at least one uppercase letter" })
      .regex(/[0-9]/, { message: " Password must contain at least one number" }) 
      .regex(/[\W_]/, { message: " Password must contain at least one special character" })
  });
  

const signup=async function (req,res) {

   try{
    const {username,email,password}=req.body
    if(!email || !username || !password){
        return res.status(400).json({errors: "All fields are required"})
    }
    const validation=userSchema.safeParse({email,username,password})
    if(!validation.success){
        // return res.status(400).json({errors: validation.error.errors})
        const errorMessage=validation.error.issues.map((err)=>err.message)
         return res.status(400).json({errors: errorMessage})
    }
    const user=await userModel.findOne({email})
    if(user){
        return res.status(400).json({errors: "user allready exist"})

    } 
    const salt=await bcrypt.genSalt(10)
    const hashPassword=await bcrypt.hash(password,salt)
    const newUser=new userModel({username,email,password:hashPassword})
    await newUser.save()
    if(newUser){
        const token=await generateTokenAndSaveInCookies(newUser._id,res)
        return res.status(201).json({message: "User register successfully",newUser,token})
    }
    
   }
   catch(error){
    console.log(error)
    res.status(500).json({errors:"Error registering user "})
   }
    
}

const login=async function (req,res) {

    const {email,password}=req.body;  
    try{
       
        if(!email || !password){
            return res.status(400).json({errors:"All fields are required"})
        }
        // verify user credential by email user exists or not 
        const verifyByEmail=await userModel.findOne({email}).select("+password");
        if(!verifyByEmail){
            return res.status(400).json({errors: "Invalid Email Address"})
        }
        
         // verify user credential by hashed password and user password from  req.body user exists or not 
         const verifyByPassword=await bcrypt.compare(password,verifyByEmail.password)
         if(!verifyByPassword){
            return res.status(400).json({ errors: "Invalid Password" });
         }
         const token=await generateTokenAndSaveInCookies(verifyByEmail._id,res)
         return  res.status(200).json({message: "User Logged in Successfully",verifyByEmail,token})
    
    }
    catch(error){
        console.log(error)
       return res.status(500).json({message: "Eroor logging user"})
    }
    
}

const logout=async function (req,res) {
    try{
        res.clearCookie("jwt",{
            path: "/"
        })
        res.status(200).json({message: "User logged out successfully"})
    }
    catch(error){
        console.log(error)
        res.status(500).json({message : "Error loging out user"})
    }
    
}

module.exports={signup,login,logout}
