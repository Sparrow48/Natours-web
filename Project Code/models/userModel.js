const crypto = require('crypto');
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
        role:{
            type:String,
            enum: ['user','guide','lead-guide','admin'],
            default: 'user'

        },
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
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpire: Date
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

userSchema.methods.passwordChangedAfter = function(JWTTimestamp ){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        return JWTTimestamp<changedTimestamp;
    }

    return false;
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpire = Date.now() + 600000;

    return resetToken;
}
const User = mongoose.model('User', userSchema);
module.exports = User;