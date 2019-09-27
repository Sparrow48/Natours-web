const mongoose= require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required : [true,'A user must have a name.']
        },
        email:{
            type: String,
            required: [true , 'Please provide your email'],
            unique: true,
            lowercase: true,
            validate:[validator.isEmail,'Please provide a valid email address.']

        },
        photo:String,
        password:{
            type: String,
            required: [true, 'Please enter your password.'],
            minlength: 8
        },
        passwordConfirm:{
            type: String,
            required: [true,'Confirm your password.'],

            validate: function(el){
                return el === this.password;
            },
            message : 'Password are not same.'
        }
    }

);


userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12);
    this.passwordConfirm = undefined;
    next();
});



userSchema.methods.correctPassword = async function(candidatePass,usrePass){
    return await bcrypt.compare(candidatePass,usrePass);
};

const User = mongoose.model('User', userSchema);
module.exports = User;