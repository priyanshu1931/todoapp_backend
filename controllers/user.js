
const User=require('../models/user.js');
const Task=require('../models/task.js');  
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.register = async(req,res)=>{
    const user=req.body;
    const exists=await User.findOne({email:user.email})
    if(exists) {
        return res.status(400).json({message:"User already exists"})
    }
    console.log(user)
    const hashedPassword=await bcrypt.hash(user.password,10)
    const newUser=await User.create({email:user.email, password:hashedPassword, name:user.name});
    console.log(process.env.JWT_SECRET);
    const token = jwt.sign({_id:newUser._id},process.env.JWT_SECRET, {
        expiresIn: 1000*60*60
    })

    console.log(token);
    res.cookie("token",token)
    res.status(201).json({
        success:true,
        message:"user created successfully",
        user:newUser
    })
}

module.exports.login =async (req,res)=>{
    
    const token=req.cookies.token;
    
    if(token)
    {
        const decodeddata=await jwt.decode(token, process.env.JWT_SECRET);
        console.log(decodeddata);
        const user=await User.findById(decodeddata._id);
        if(user)
        {
            return res.json({
                success:true,
                message:"you are already logged in",
                user:user
            })
        }
        else
        {
            return res.json({
                success:false,
                message:"you are not a legitimate user",
            })
        }
    }
    const user=await User.findOne({email:req.body.email}).select('+password')
    if(user)
    {
        const pass=req.body.password;
        console.log(user.password,pass);
        const val=await bcrypt.compare(pass, user.password);
        console.log(val);
        if(val){ 
            const token = jwt.sign({_id:user._id},process.env.JWT_SECRET, {
                expiresIn: 1000*60*60
            })
            res.cookie("token",token)
            return res.json({
                success:true,
                message:"you are logged in",
                user:user
            })
        }
        else{    
            return res.json({
                success:false,
                message:"wrong password"
            })
        }
    }
    else{
        return res.json({
            success:false,
            message:"user not found"
        })
    }

}
module.exports.getAllTasks=async (req,res)=>{
    
    let token=req.headers.cookie;
    if(token)
    {
        token=req.headers.cookie.substr(6);
        const decodeddata=jwt.decode(token, process.env.JWT_SECRET);
        const user= await User.findById(decodeddata._id);
        if(user)
        {
            const tasks=await Task.find({user: decodeddata._id});
            return res.json({
                success:true,
                tasks:tasks,
            })
        }
        else
        {
            return res.json({
                success:false,
                message:"you are not a legitimate user",
            })
        }
    }
    else{
        
        return res.json({
            success:false,
            message:"kindly login first"
        })
    }
}
module.exports.createTasks = async (req,res) => {
    let token=req.headers.cookie;
    if(token)
    {
        token=req.headers.cookie.substr(6);
        const decodeddata=await jwt.decode(token, process.env.JWT_SECRET);
        const user= await User.findById(decodeddata._id);
        if(user) {
            const task=await Task.create({title:req.body.title,
            description:req.body.description,
            isCompleted:true,
            user:user._id});
            return res.json({
                success:true,
                message:"task created successfully",
                task:task,
            })
        }
        else
        {
            return res.json({
                success:false,
                message:"you are not a legitimate user",
            })
        }
    }
    else{
        
        return res.json({
            success:false,
            message:"kindly login first"
        })
    }
}

    

module.exports.myProfile = async (req,res) => {
    let token=req.headers.cookie;
    if(token)
    {
        token=req.headers.cookie.substr(6);
        const decodeddata=jwt.decode(token, process.env.JWT_SECRET);
        const user= await User.findById(decodeddata._id);
        if(user)
        {
            const tasks=await Task.find({user: decodeddata._id});
            return res.json({
                success:true,
                user:user,
                tasks:tasks,
            })
        }
        else
        {
            return res.json({
                success:false,
                message:"you are not a legitimate user",
            })
        }
    }
    else{
        
        return res.json({
            success:false,
            message:"kindly login first"
        })
    }
}
module.exports.logout = (req,res)=>{
    res.clearCookie('token');
    res.json({success:true, message:"logout successfully"}) 
}

module.exports.getTaskByTitle = async (req,res) => {
    let token=req.headers.cookie;
    if(token)
    {
        token=req.headers.cookie.substr(6);
        const decodeddata=jwt.decode(token, process.env.JWT_SECRET);
        const user= await User.findById(decodeddata._id);
        if(user) {
            const title=req.params.title;
            const task=await Task.find({title:title});
            if(task) {
            return res.json({
                success:true,
                data:{task},
                message:"this is your task with the following title",
            })
            }
            else
            {
                return res.json({
                    success:false,
                    message:"no task found with the given title",
                })
            }   
        }
        else{
            return res.json({
                success:false,
                message:"you are not a legitimate user",
            })
        }
    }
    else{
        return res.json({
            success:false,
            message:"kindly login first"
        })
    }
}