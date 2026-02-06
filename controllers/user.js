const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const signToken = (userId, role)=>{
    return jwt.sign(
        {id:userId, role:role},
        process.env.JWT_SECRET,
        {expiresIn: "24h"}
    );
};

//Register
exports.register = catchAsync(async(req, res, next) => {
    const { name, email, phonenumber, password } = req.body;

    const userExists = await User.findOne({
        $or: [
        { email },
        { phonenumber }
    ]}
    );


    if(userExists){
        return next(new AppError("User Email or phone number already exists", 400));

    }

    const user = await User.create({
        name,
        email,
        phonenumber,
        password,
    });

    
    res.status(201).json({
        message:"User registered successfully"
    });
});

//Login
exports.login = catchAsync(async(req,res,next)=>{
    const{email, password} = req.body;
    const user = await User.findOne({email}).select("+password");
    if (!user){
        return next(new AppError("Invalid credentials",401));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return next(new AppError("Invalid credentials",401));
    }

    const token = signToken(user._id,user.role);

    res.json({
        message:"Login successfully",
        token
    });
});

//get pprofile
exports.getMe = catchAsync(async(req,res, next)=>{
    const user = await User.findById(req.user.id).select("-password");
    if(!user){
        return next(new AppError("User not found",404));
    }
    res.status(200).json({
        status:"success",
        user,
    });
});

//update profile
exports.updateMe = catchAsync(async(req,res,next)=>{
    const {name, phonenumber} =req.body;

    const updateUser = await User.findByIdAndUpdate(
        req.user.id,
        {name,phonenumber},
        {
            new:true,
        }
    ).select("-password");

    res.status(200).json({
        status:"success",
        user:updateUser,
    });
});
