const express = require('express');
const router=express.Router();
const {register,login,getAllTasks,myProfile,createTasks,logout,getTaskByTitle} =require('../controllers/user.js');

router.post('/register',register)
router.post('/login',login)
router.get('/profile',myProfile)
router.get('/tasks',getAllTasks)
router.post('/tasks',createTasks)
router.get('/logout',logout)
router.get('/tasks/:title',getTaskByTitle)


module.exports = router;



