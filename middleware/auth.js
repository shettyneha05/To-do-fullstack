const { json } = require('express');
const jwt=require('jsonwebtoken');
require('dotenv').config();

const verifyToken=(req,res,next)=>{
    const token=req.headers.authorization?.split(' ')[1];
    if(!token)
        return res.status(401).json({error: 'Access denied'});

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.userId=decoded.userId;
        next();
    }
    catch(err){
        res.status(401).json({error:'Invalid token'});
    }
};

module.exports=verifyToken;