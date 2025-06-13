const mongoose=require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("Mongodb connected"))
.catch(err => console.log("error found",err));

module.exports=mongoose;
