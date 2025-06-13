const mongoose=require("mongoose");

const todoSchema=mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    dueDate:{
        type:Date
    },
    user:{
        type:mongoose.Schema.Types.ObjectId, ref:'User'
    },
});


module.exports=mongoose.model('Todo',todoSchema);