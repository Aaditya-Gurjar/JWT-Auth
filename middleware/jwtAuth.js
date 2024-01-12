const JWT = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
    // const token = (req.cookies || req.cookies.token) || null;

    let token;

    // Check if the token is present in the request headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        // Extract the token from the Authorization header
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        // Extract the token from the cookies
        token = req.cookies.token;
    }


    if(!token) {
        return res.status(400).json({
            success : false,
            message : "Not Authorized"
        })
    }

    try {
        const payLoad = JWT.verify(token, process.env.SECRET)
        req.user = {id : payLoad.id, email : payLoad.email}
    } catch (error) {
        return res.status(400).json({
            success : false,
            message : error.message
        })
    }
    next();
}

module.exports = jwtAuth;