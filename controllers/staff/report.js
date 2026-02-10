const Order = require("../../models/order");
const {Parser} = require("json2csv")
const {getTodayRange, getWeeklyRange, getMonthlyRange} = require("../../utils/dataRanges");
const Menu = require("../../models/menu");
const User = require("../../models/user");

exports.getOrderCounts = async(req,res)=>{
    const today = getTodayRange();
    const week = getWeeklyRange();
    const monthly = getMonthlyRange();

    const todayCount = await Order.countDocuments({
        createdAt:{
            $gte:today.start,
            $lte:today.end
        }
    });
    const weeklyCount = await Order.countDocuments({
        createdAt:{
            $gte:week.start,
            $lte:week.end
        }
    });
    const monthlyCount = await Order.countDocuments({
        createdAt:{
            $gte:monthly.start,
            $lte:monthly.end
        }
    });

    res.status(200).json({
        today:todayCount,
        weekly:weeklyCount,
        monthly:monthlyCount
    });
};

exports.getMenuCount = async(req,res)=>{
    const today = getTodayRange();
    const weekly= getWeeklyRange();
    const monthly= getMonthlyRange();

    const todayCount= await Menu.countDocuments({
        createdAt:{
            $gte:today.start,
            $lte:today.end
        }
    });
    const weeklyCount= await Menu.countDocuments({
        createdAt:{
            $gte:weekly.start,
            $lte:weekly.end
        }
    });
    const monthlyCount= await Menu.countDocuments({
        createdAt:{
            $gte:monthly.start,
            $lte:monthly.end
        }
    });
    res.status(200).json({
        today:todayCount,
        weekly:weeklyCount,
        monthly:monthlyCount
    });
};

exports.getUserCount = async(req,res)=>{
    const today = getTodayRange();
    const weekly = getWeeklyRange();
    const monthly = getMonthlyRange();

    const todayCount = await User.countDocuments({
        createdAt:{
            $gt:today.start,
            $lte:today.end
        }
    });
    const weeklyCount = await User.countDocuments({
        createdAt:{
            $gte:weekly.start,
            $lte:weekly.end
        }
    });
    const monthlyCount = await User.countDocuments({
        createdAt:{
            $gt:monthly.start,
            $lte:monthly.end
        }
    });
    res.status(200).json({
        today:todayCount,
        weekly:weeklyCount,
        monthly:monthlyCount
    });
};

exports.exportOrderCSV = async(req,res)=>{
    const orders = await Order.find().lean();

    const json2csv = new Parser();
    const csv = json2csv.parse(orders);

    res.header("Content-type","test/csv");
    res.attachment("orders.csv");
    res.send(csv);
};

exports.exportMenuCSV = async(req,res)=>{
    const menu = await Menu.find().lean();

    const json2csv = new Parser();
    const csv = json2csv.parse(menu);

    res.header("Content-type","text/csv");
    res.attachment("menu.csv");
    res.send(csv);
};

exports.exportUserCSV = async(req,res)=>{
    const user= await User.find().lean();

    const json2csv = new Parser();
    const csv = json2csv.parse(user);

    res.header("Content-Type","text/csv");
    res.attachment("user.csv");
    res.send(csv);
}

