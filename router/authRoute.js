const express = require('express');
const { signUp, signin, getUser, logout} = require('../controller/authController');
const jwtAuth = require('../middleware/jwtAuth');

const authRouter = express.Router();

authRouter.post('/signup', signUp)
authRouter.post('/signin', signin)
authRouter.get('/user',jwtAuth ,getUser)
authRouter.get('/logout', logout)

module.exports = authRouter;