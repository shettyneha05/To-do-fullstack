const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const User=require('../models/user');
const bcrypt=require('bcryptjs');
require('dotenv').config();


router.post('/signup',async (req,res)=>{
    try{
        const { username , password }= req.body;
        const existingUser=await User.findOne({username});
        if(existingUser) return res.status(400).json({error: 'Username Taken'});

        const user=new User({username , password});
        await user.save();
        res.status(201).json({message:'User created'});
    }
    catch(err){
        res.status(500).json({error: 'Server error'});
    }
});

router.post('/login', async (req,res)=>{
    try{
    const { username , password }=req.body;

    const user=await User.findOne({username});
    if (!user) return res.status(400).json({error:'Invalid credentials'});
    
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch) return res.status(400).json({error:'Incorrect password'});

    const token=jwt.sign({userId:user._id}, process.env.JWT_SECRET,{ expiresIn: '1h'}); //({payload},{secret},{additional}
    res.json({ token });
    }
    catch(err){
        res.status(500).json({error:'Server error'});
    }
});

module.exports=router;

