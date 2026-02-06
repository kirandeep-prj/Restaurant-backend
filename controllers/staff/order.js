const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");
const Order = require("../../models/order");

exports.getAllOrders = catchAsync(async(req,res, next)=>{
    const filters = {};
    if(req.query.status != undefined){
        filters.status = req.query.status;

    }
    if(req.query.paymentStatus != undefined){
        filters.paymentStatus = req.query.paymentStatus;

    }
    if(req.query.fromDate || req.query.toDate){
        filters.createdAt ={};

        if(req.query.fromDate){
            filters.createdAt.$gte  = new Date(req.query.fromDate);
        }
        if(req.query.toDate){
            filters.createdAt.$lte = new Date(req.query.toDate);
        }
    }

    let sort ={};
    if(req.query.sortBy){
        sort[req.query.sortBy]=req.query.order === "asc" ? 1:-1;
    }
    // else{
    //     sort.createdAt = -1;
    // }

    const page= Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page-1)*limit;

    const orders = await Order.find(filters)
    .sort(sort)
    .skip(skip)
    .limit(limit);

    const totalOrders = await Order.countDocuments(filters);

    res.status(200).json({
        success:true,
        count:orders.length,
        totalOrders,
        totalPages:Math.ceil(totalOrders / limit),
        currentPage: page,
        data: orders,
    });
});

exports.getSingleOrder = catchAsync(async(req,res,next)=>{
    const order= await Order.findById(req.params.id);
    if(!order){
        return next(new AppError("Order not found",404));
    }
    res.status(200).json({
        success:true,
        data:order
    })
})

exports.getCustomerOrder = catchAsync(async(req,res,next)=>{
    const order= await Order.find({user:req.params.id});
    if(!order){
        return next(new AppError("Order not found",404));
    }
    res.status(200).json({
        success:true,
        count: order.length,
        data:order
    })
})

exports.updateOrderStatus = catchAsync(async(req,res,next)=>{
   const {status: newStatus, cancellationReason} = req.body;
   const order = await Order.findById(req.params.id);

   if(!order){
    return next(new AppError("Order not found",404));
   }
   if(["delivered", "cancelled"].includes(order.status)){
    return next(new AppError(`Order already ${order.status}`, 400));
   }
   const statusFlow = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered"
   ];

   if(newStatus === "cancelled"){
    if(!cancellationReason){
        return next(new AppError("Cancellation reason is required",400));
   }

   order.status = "cancelled";
   order.cancellationReason = cancellationReason;
   await order.save();

   return res.status(200).json({
    success:true,
    data:order
   });
    }
   const currentIndex = statusFlow.indexOf(order.status);
   const newIndex = statusFlow.indexOf(newStatus);

   if(newIndex === -1){
        return next(new AppError("Invalid status value",400));
   }

   if(newIndex !== currentIndex +1){
    return next(new AppError(`Invalid status transition from ${order.status} to ${newStatus}`, 400));
   }

   order.status = newStatus;
   await order.save();

   res.status(200).json({
    success:true,
    data:order
   });
})