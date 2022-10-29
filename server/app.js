const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const app  = express();

dotenv.config({path:'./config.env'});
require('./db/conn');
//const User = require('./model/userSchema');

app.use(express.json());   //makes the app able to understand json type objects(middleware)

app.use(require('./router/auth'));    //linked the router files to make our route easy
const PORT = process.env.PORT;




    
/*Middleware*/ 

const middleware = (req,res,next) => {
    console.log("Hello my Middleware"); 
    next();                                                      // next ko call karne pe hi hamara about page middleware ke bad call hoga  
}
 

app.get('/', (req,res) => {
     res.send('Hello World from  Realm server')
});
app.get('/about',middleware, (req,res) => {
    console.log('About Page ');
    res.send('Hello World from  Realm server : About Page')
});
app.get('/signin', (req,res) => {
    res.send('Hello World from  Realm server :  Login Page')
});
app.get('/signup', (req,res) => {
    res.send(`Hello World from  Realm server : signup page`)
});

app.listen(PORT,() => {
    console.log(`Server is running at Port:${PORT}`)
})