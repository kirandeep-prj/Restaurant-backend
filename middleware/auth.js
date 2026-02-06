const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const auth = catchAsync(async(req, res, next)=>{
    let token;

    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")
    ){
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        return next(new AppError("You are not logged in",401));
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if(!user){
        return next(new AppError("User no longer exists",401));
    }

    req.user={
        id: user._id,
        role: user.role
    };

    next();
});

module.exports = auth;