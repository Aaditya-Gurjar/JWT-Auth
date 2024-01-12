const mongoose = require('mongoose')
const JWT = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const{ Schema } = mongoose;

const userSchema = new Schema({
    name:{
        type:String,
        required:[true, "Name Required !"],
        minLength:[3, "Name must be at least 3 charcters"],
        maxLength : [20, "Name must be less than 20 characters"],
        trim : true
    },

    email : {
        type:String,
        required:[true, "Email is required"],
        unique:[true, "Email already exist"],
        lowercase : true
    },

    password : {
        type :String,
        required : true,
        select : false
    },

    forgotPasswordToken : {
        type : String
    },
    
    forgotPasswordExpiryDate : {
        type : Date
    }
})

userSchema.pre("save", async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    return next();
})

userSchema.methods = {
    jwtToken(){
        return JWT.sign(
            {id: this._id, email : this.email},
            process.env.SECRET,
            {expiresIn : '24h'}
        )
    }
}

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;