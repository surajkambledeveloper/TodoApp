const express=require("express");
const mongoose=require("mongoose")
const app=express();
const dotenv=require("dotenv")
const todo_route=require("./routes/todo.route")
const user_route=require("./routes/user.route")
const cors=require("cors")
const cookieParser = require("cookie-parser");
dotenv.config();

// middlewares
app.use(express.json())
app.use(cookieParser()); // Use before routes

// app.use(cors({
//     origin:process.env.FRONT_END_URL,
//      // here Credential true because jo bhi fronend se reponse ayega lelo 
//     credentials:true,
//     methods:"GET,POST,PUT,DELETE",
//     allowedHeaders:["Content-Type", "Authorization"]
// }))
app.use(cors());

const PORT=process.env.PORT ||8000


mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("Database connected")
})
.catch((Error)=>{
    console.log(Error)
})

//routes

app.use("/todo",todo_route)
app.use("/user",user_route)


app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})
