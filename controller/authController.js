
const userModel = require('../models/userSchema.js')
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt')

const signUp = async (req, res, next) => {
    const {name, email, password, confirmPassword} = req.body;
    if(!name || !email || !password || !confirmPassword){
        return res.status(400).json({
            success : false,
            message : "Every Field is Required !"
        })
    }

    const validEmail = emailValidator.validate(email);
    if(!validEmail){
        return res.status(400).json({
            success : false,
            message : "Please Provide Valid Email ID !"
        })
    }

    if(password !== confirmPassword){
        return res.status(400).json({
            success : false,
            message : "Password and confirm Pasword mismatch !"
        })
    }

    try {
        const userInfo = userModel(req.body)
         const result = await userInfo.save();

        res.status(200).json({
            success : true,
            data : {result}
        })
    } catch (error) {
        if(error.code === 11000){
            return res.status(400).json({
                success : false,
                message : "Account already exists"
            })
        }
        return res.status(400).json({
            success : false,
            message : error.message
        })
    }
   
}

const signin = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({
            success : false,
            message : "All Fields are required "
        })
    }

    try {
        const user = await userModel.findOne({email}).select("+password")

        if(!user || ! await bcrypt.compare(password, user.password) ){
            return res.status(400).json({
                success : false,
                message : "Invalid Credentials"
            })
        }
    
        const token = user.jwtToken();
        user.password = undefined
    
        const cookieOption = {
            maxAge : 24 * 60 * 60 * 1000,
            httpOnly : true
        }
    
        res.cookie('token', token, cookieOption);
        res.status(200).json({
            success : true,
            data : user,
        })
    
    } catch (error) {
        res.status(400).json({
            success : false,
            message: error.message
        })
        
    }
}

const getUser = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const user = await userModel.findById(userId);
        return res.status(200).json({
            success : true,
            data : user
        })
        
    } catch (error) {
        return res.status(400).json({
            success : true,
            message : error.message
        })
    }
}

const logout = (req,res, next) => {
    try {

        const cookieOption = {
            expires : new Date(),
            httpOnly : true,
        }
        res.cookie('token', null, cookieOption);
        res.status(200).json({
            success : true,
            message: "Logged Out Successfuly"
        })
        
    } catch (error) {
        return res.status(400).json({
            success : false,
            message : "Error Occured : " + error.message
        })
    }
}

module.exports = {signUp, signin, getUser, logout};