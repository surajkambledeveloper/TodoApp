const express=require("express")
const router=express.Router();
const user_controller=require("../controller/user_controller");

router.post("/signup",user_controller.signup)
router.post("/login",user_controller.login)
router.get("/logout",user_controller.logout)

module.exports=router