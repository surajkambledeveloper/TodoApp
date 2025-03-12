const express=require("express")
const router=express.Router();
const todoController=require("../controller/todo_controller");
const { authenticate } = require("../middaleware/authorize");

router.post("/create",authenticate ,todoController.createTodo)
router.get("/fetch",authenticate, todoController.getTodos)
router.put("/update/:id", authenticate,todoController.updateTodo)
router.delete("/delete/:id",authenticate,todoController.deleteTodo)

module.exports=router
