const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


require('../db/conn');      //connection with database
const User = require("../model/userSchema")

router.get('/', (req,res) => {
    res.send('Hello World from  Realm server  router js');     //get used to read
});


/*     Promises Wala Method   */

// router.post('/Register',(req,res) =>{

    

     

//     const {name,email,phone,work,password,cpassword} = req.body;

    

//     if(!name ||!email || !phone || !work || !password || !cpassword)
//     {
//         return res.status(422).json({error:"Please fill all the feild properly"});
//     }
    

//     User.findOne({email:email})
//     .then((userExist) => {
//         if(userExist){
//             return res.status(422).json({ error: "Eamil already Exist"});
//         }

//         const user = new User({name,email,phone,work,password,cpassword});

//         user.save().then(() => {
//             res.status(201).json({ message: "user successfully registered"});
//         }).catch((err) => res.status(500).json({error:"Failed to register"}));
//     }).catch(err => {console.log(err);});



// });


router.post('/Register',async(req,res) =>{

    const {name,email,phone,work,password,cpassword} = req.body;


    if(!name ||!email || !phone || !work || !password || !cpassword)
    {
        return res.status(422).json({error:"Please fill all the feild properly"});
    }
    
    try {
        

    const userExist = await User.findOne({email:email});

    if(userExist){ 
        return res.status(422).json({ error: "Eamil already Exist"});
    }
    else if(password != cpassword)
    {
        return res.status(422).json({error: "Password Not Matching"});
    }
    else{

    


    const user = new User({name,email,phone,work,password,cpassword});

    //aisa method call kare taki password ki hashing kar sake

    
    
    await user.save();
    res.status(201).json({ message:"user successfully registered"});
    

   
    }
}
    catch(err) {
        console.log(err);

    }

}); 

/*   Login  */ 
router.post('/login',async(req,res) => {
    let token;
    const{email,password}=req.body;

    if(!email || !password)
    {
        return res.status(422).json({error:"Please fill all Credentials"})
    }


try{

    
    const userlogin = await User.findOne({email:email});

    if(userlogin)
    { 
        const isMatch = await bcrypt.compare(password,userlogin.password);
        
         token = await  userlogin.generateAuthToken();    // returns promose so use await
         console.log(token);
         res.cookie("jwtoken",token,{
            expires:new Date(Date.now() + 25982000000),
            httpOnly:true
         });
            

        if(isMatch)      // hamne pahle hi userlogin.password me email authenticate karwya hai
        {
            return res.status(200).json({message: "Login Successful"});
        }
        else{
            return res.status(404).json({error:"Invalid Credentials"}); 
        }
    }
    else{
        return res.status(404).json({error:"Invalid Credentials"});
    }
   
    
   
}
catch{
    return res.status(404).json({error:"Invalid Credentials"});
    
}
}) 





module.exports = router;
