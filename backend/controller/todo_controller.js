const todoModel=require("../models/todo.model")

const createTodo = async function (req, res) {
    const todo = new todoModel({
        text: req.body.text,
        completed: req.body.completed,
        // after milldaleware 
        user:req.user._id   //associate todo with logged in user
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json({ msg: "Todo Created Successfully", newTodo }); // Return all todos
    } catch (Error) {
        console.log(Error);
        res.status(400).json({ msg: "Error occurring in todo creation" });
    }
};


// todo get all data 
const getTodos=async function (req,res) {
    try{
        const todos=await todoModel.find({user:req.user._id }) // fetch todos only from logged user
        res.status(201).json({msg: "Todo fetching  Successfully",todos});

    }
    catch(Error){
        console.log(Error)
        res.status(400).json({msg: "Error occuring in todo fetching"})

    }
    
}

// todo update perticular data by id 

const updateTodo=async function (req,res) {
    try{
        const todo=await todoModel.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
        })
        res.status(201).json({msg: "Todo Updated  Successfully",todo});
    }
    catch(Error){
        // console.log(Error)
        res.status(400).json({msg: "Error occuring in todo updating"})
    }
    
}

// todo delete perticular data by id 

const deleteTodo=async function (req,res) {
    try{
      const todo=  await todoModel.findByIdAndDelete(req.params.id)
      if(!todo){
        return  res.status(404).json({msg: "Todo not found"})
      }
        res.status(201).json({msg: "Todo Deleted  Successfully"});
    }
    catch(Error){
        console.log(Error)
        res.status(400).json({msg: "Error occuring in todo deletion"})

    }
    
}


module.exports={createTodo,getTodos,updateTodo,deleteTodo}