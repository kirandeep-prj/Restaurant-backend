const Order = require("../../models/order");
const {Parser} = require("json2csv")
const {getTodayRange, getWeeklyRange, getMonthlyRange} = require("../../utils/dataRanges");

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

exports.exportCSV = async(req,res)=>{
    const orders = await Order.find().lean();

    const json2csv = new Parser();
    const csv = json2csv.parse(orders);

    res.header("Content-type","test/csv");
    res.attachment("orders.csv");
    res.send(csv);
};

