const express = require("express");
const router = express.Router();
const restrictTo = require("../../middleware/restrictTo");
const auth = require("../../middleware/auth");
const delivery = require("../../controllers/delivery/order")

router.get("/getAvailableOrders",auth,restrictTo("deliveryPartner"), delivery.getAvailableOrders);
router.get("/getMyDeliveries",auth,restrictTo("deliveryPartner"), delivery.getMyDeliveries);
router.patch("/assign/:orderId",auth,restrictTo("deliveryPartner"),delivery.assignOrderToSelf);
router.patch("/complete/:orderId",auth,restrictTo("deliveryPartner"),delivery.completeDelivery);

module.exports = router;