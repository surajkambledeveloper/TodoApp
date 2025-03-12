const mongoose=require("mongoose")

const todoSchema=new mongoose.Schema(
    {
        text:{
            type:String,
            required:true
        },
        completed:{
            type:Boolean,
            required:true
        },
        // after middleware 
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",  // referencing User model to connect to user collection in mongodb
            required: true
        }
    }
)
module.exports=mongoose.model("todo",todoSchema)

