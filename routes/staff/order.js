const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const restrictTo = require("../../middleware/restrictTo");

const order = require("../../controllers/staff/order");

router.get("/getAllOrders",auth,restrictTo("staff"),order.getAllOrders);
router.get("/getSingleOrder/:id",auth,restrictTo("staff"),order.getSingleOrder);
router.get("/getCustomerOrder/:id",auth,restrictTo("staff"),order.getCustomerOrder);
router.patch("/updateOrderStatus/:id",auth,restrictTo("staff"),order.updateOrderStatus);

module.exports = router;