const express=require('express');
require('dotenv').config();
const {connect} = require('./dbconfig/db.js');
const cookieparser=require('cookie-parser');

const userRouter=require('./routes/user');
connect();

const app = express();
app.use(express.json());
app.use(cookieparser())
app.use(express.urlencoded({extended:true}));
app.use('/user',userRouter);
app.listen(process.env.PORT,()=>{
    console.log(`Server is running at ${process.env.PORT}`);
})