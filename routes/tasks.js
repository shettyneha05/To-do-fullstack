const express=require('express');
const Todo=require('../models/todo');
const verifyToken=require('../middleware/auth');
const router=express.Router();

router.use(verifyToken);

router.get('/',async (req,res)=>{
    try{
        const todo=await Todo.find({ user:req.userId});
        res.json(todo);
    }
    catch(err){
        res.status(500).json({error:'Server error'});
    }
});


router.post('/', async (req, res) => {
  try {
    const { text, dueDate } = req.body;
    const todo = new Todo({ text, dueDate, user: req.userId });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add this PUT route to handle task updates (e.g., checkbox toggles)
router.put('/:id', async (req, res) => {
  try {
    const { text, completed, dueDate } = req.body;
    
    // Update only if the task belongs to the current user
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { text, completed, dueDate },
      { new: true } // Return the updated document
    );

    if (!updatedTodo) return res.status(404).json({ error: 'Task not found' });
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});



router.delete('/:id', async (req,res)=>{
    try{
        await Todo.findOneAndDelete({_id:req.params.id , user:req.userId});
        res.json({ message: 'Todo deleted'});
    }
    catch(err){
        res.status(500).json({error:'Server error'});
    }
});

module.exports=router;