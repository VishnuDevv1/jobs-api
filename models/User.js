const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')
require('dotenv').config


const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'pls provide name'],
        minlength:3,
        maxLength:20
    },
    email:{
        type:String,
        required:[true, 'pls provide email'],
        minlength:3,
        maxLength:20,
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    'pls provide valid email'],
    unique:true 
    },
    password:{
        type:String,
        required:[true, 'pls provide name'],
        minlength:4
    },
})

UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

})

UserSchema.methods.getName = function() {
    return this.name;
}

UserSchema.methods.createJWT = function() {
        return jwt.sign({userId: this._id, name: this.name}, process.env.JWT_SECRET , {expiresIn:process.env.JWT_LIFETIME})
}

UserSchema.methods.comparePassword = async function(password) {
    const isMatch = await bcrypt.compare(password, this.password)
    return isMatch;
}

module.exports = mongoose.model('user', UserSchema);