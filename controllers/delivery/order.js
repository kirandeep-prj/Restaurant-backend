const User = require("../../models/user");
const Order = require("../../models/order");
const catchAsync=require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");
const DeliveryTracking = require("../../models/delivery");

exports.getAvailableOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({
    status: "ready",
    deliveryPartner: null
  })
    .select("orderNumber items totalAmount deliveryAddress status paymentMethod")
    .populate("user", "name phonenumber");

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

exports.assignOrderToSelf = catchAsync(async(req,res,next)=>{
    const{orderId} = req.params;
    const deliveryPartnerId = req.user.id;

    const order = await Order.findById(orderId);
    if(!order){
        return next(new AppError("Order not found",404));
    }
    if(order.status !== "ready"){
        return next(new AppError("Only ready orders can be assigned",400));
    }
    if(order.deliveryPartner){
        return next(new AppError("Order already Assigned",400));
    }
    const activeDeliveries = await Order.countDocuments({
        deliveryPartner:deliveryPartnerId,
        status:{$ne:"delivered"}
    });
    if(activeDeliveries >= 3){
        return next(new AppError("Delivery Limit Exceeded (max 3",400));
    }
    await DeliveryTracking.create({
        order:order._id,
        deliveryPartner:deliveryPartnerId
    });

    order.deliveryPartner = deliveryPartnerId;
    order.assignedAt = new Date();
    order.status = "ready";
    await order.save();

    res.status(200).json({
        success:true,
        message:"Order assigned successfully",
        data:order
    });
});

exports.completeDelivery = catchAsync(async(req,res,next)=>{
    const {orderId} = req.params;
    const deliveryPartnerId = req.user.id;

    const order = await Order.findById(orderId);

    if(!order){
        return next(new AppError("Order not Found",404));
    }
    if(!order.deliveryPartner || order.deliveryPartner.toString() !== deliveryPartnerId.toString()){
        return next(new AppError("Not authorized for this order",403));
    }
    if(!order.status === "delivered"){
        return next(new AppError("Order already delivered",400));
    }
    if(order.status !== "out_for_delivery" && order.status !== "picked" && order.status !== "ready"){
        return next(new AppError("Invalid Order state for completion",400));
    }
    const tracking = await DeliveryTracking.findOne({
        order:orderId,
        deliveryPartner:deliveryPartnerId
    });
    if(!tracking){
        return next(new AppError("Delivery Tracking Not Found",404));
    }
    if(order.status === "ready"){
        order.pickedAt=new Date();
        order.status="out_for_delivery";

        tracking.status = "picked";
        tracking.pickedAt = new Date();

        await order.save();
        await tracking.save();

        return res.status(200).json({
            success:true,
            message:"Order picked Successfully",
            data:order
        });
    }
    order.status = "delivered";
    order.deliveredAt = new Date();

    if(order.paymentMethod === "cash"){
        order.paymentStatus = "paid";
    }
    tracking.status="delivered";
    tracking.deliveredAt = new Date();

    await order.save();
    await tracking.save();

    res.status(200).json({
        success:true,
        message:"Order delivered successfully",
        data:order
    });
});

exports.getMyDeliveries = catchAsync(async(req,res,next)=>{
    const deliveryPartnerId = req.user.id;

    const filter ={
        deliveryPartner:deliveryPartnerId
    };

    if(req.query.deliveryStatus){
        filter.status = req.query.deliveryStatus;
    }
    const deliveries = await Order.find(filter)
        .populate("user" ,"name phonenumber")
        .select ("orderNumber items finalAmount deliveryAddress status paymentMethod pickedAt deliveredAt createdAt")
        .sort({createdAt:-1});
    res.status(200).json({
        success:true,
        count:deliveries.length,
        date:deliveries
    })
})