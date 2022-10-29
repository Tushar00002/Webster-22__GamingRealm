const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    tokens: [
        {   
            token:{
              type: String,
              required:true
            }
        }
    ]
    
})




userSchema.pre('save',async function(next){
    if(this.isModified('password'))       //konsa data agar change to mai iske andar jo bhi perform ho use call karna chahunga
    {   
        console.log("Hi from Hasher");
        this.password = await bcrypt.hash(this.password,12);  //password ko hash kar diya
        this.cpassword = await bcrypt.hash(this.cpassword,12);
    }
    next();
});

// Generating Token

userSchema.methods.generateAuthToken = async function(){

    try{
            let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY);                //jwt.sign(payload,secret key)
            this.tokens = this.tokens.concat({token:token});
            await this.save();
            return token;
        }                                                                       //payload must be unique
    catch (err){
        console.log(err);
    }
}
 
const User = mongoose.model('USER',userSchema);

module.exports = User;