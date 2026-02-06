const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");
const Menu = require("../../models/menu");
const Order = require("../../models/order");
const applyDiscount = require("../../utils/discount");

exports.createOrder = catchAsync(async (req, res, next) => {
  const { items, deliveryAddress, paymentMethod, specialInstructions } = req.body;

  if (!items || items.length === 0) {
    return next(new AppError("Order must contain at least one item", 400));
  }

  let orderItems = [];
  let totalAmount = 0;
  let preparationTimes = []; // ✅ store times in array

  for (let i = 0; i < items.length; i++) {
    const { menuItemId, quantity } = items[i];

    const menuItem = await Menu.findOne({
      _id: menuItemId,
      isAvailable: true,
      isDeleted: false,
    });

    if (!menuItem) {
      return next(
        new AppError(`Menu item ${menuItemId} is not available`, 404)
      );
    }

    const itemPrice = menuItem.price;
    const prepTime = menuItem.preparationTime; // minutes (Number)

    preparationTimes.push(prepTime);

    const subtotal = itemPrice * quantity;
    totalAmount += subtotal;

    orderItems.push({
      menuItemId: menuItem._id,
      itemName: menuItem.name,
      itemPrice,
      quantity,
      subtotal,
    });
  }

  // ✅ max preparation time
  const TotalPreparationTime = Math.max(...preparationTimes);

  // ✅ current IST time
  const nowIST = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  // ✅ estimated delivery time (prep + 30 min buffer)
  const estimatedDeliveryTime = new Date(
    nowIST.getTime() + (TotalPreparationTime + 30) * 60 * 1000
  );

  const generateOrderNumber = () => {
  return `ORD${Date.now()}${Math.random()
    .toString(36)
    .slice(2, 4)
    .toUpperCase()}`;
  };
  const orderNumber = generateOrderNumber();
  const { discountAmount, finalAmount } = applyDiscount(totalAmount);

  const createOrder = await Order.create({
    orderNumber,
    user: req.user.id,
    items: orderItems,
    totalAmount,
    discountAmount,
    finalAmount,
    deliveryAddress,
    paymentMethod,
    specialInstructions,
    TotalPreparationTime, 
    estimatedDeliveryTime,
    status:"pending",
    paymentStatus:"pending"
  });
  const order = await Order.findById(createOrder._id)
  .select("orderNumber items totalAmount discountAmount finalAmout deliveryAddress TotalPreparationTime paymentMethod estimatedDeliveryTime status deliveryPArtner pickedAt deliveredAt");

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: {
      ...order.toObject(),
      preparationTimeFormatted: `${TotalPreparationTime} minutes`,
      estimatedDeliveryTimeIST: estimatedDeliveryTime.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
    },
  });
});

exports.getOwnOrder = catchAsync(async(req,res,next)=>{
  const filters ={
    user : req.user.id
  };
  if(req.query.status){
    filters.status = req.query.status;
  }
  if (req.query.paymentStatus) {
    filters.paymentStatus = req.query.paymentStatus;
  }

  // Date range filter
  if (req.query.fromDate || req.query.toDate) {
    filters.createdAt = {};

    if (req.query.fromDate) {
      filters.createdAt.$gte = new Date(req.query.fromDate);
    }

    if (req.query.toDate) {
      filters.createdAt.$lte = new Date(req.query.toDate);
    }
  }

  // Sorting
  const sort = {};
  if (req.query.sortBy) {
    sort[req.query.sortBy] = req.query.order === "asc" ? 1 : -1;
  } else {
    sort.createdAt = -1; // default sort
  }

  // Pagination
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find(filters)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const totalOrders = await Order.countDocuments(filters);

  res.status(200).json({
    success: true,
    count: orders.length,
    totalOrders,
    totalPages: Math.ceil(totalOrders / limit),
    currentPage: page,
    data: orders
  });
});

exports.cancelledOrder = catchAsync(async(req,res,next)=>{
  const {cancellationReason} = req.body;
  const order= await Order.findById(req.params.id);

  if(!order){
    return next(new AppError("Order not found",404));
  }
  if(["delivered", "cancelled"].includes(order.status)){
      return next(new AppError(`Order already ${order.status}`, 400));
  }

   if (!["pending", "confirmed"].includes(order.status)) {
    return next(
      new AppError("You cannot cancel the order at this stage", 400)
    );
  }

  if (!cancellationReason) {
    return next(
      new AppError("Cancellation reason is required", 400)
    );
  }

  order.status = "cancelled";
  order.cancellationReason = cancellationReason;
  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
})

