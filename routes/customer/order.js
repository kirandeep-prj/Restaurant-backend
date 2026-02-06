const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const validate = require("../../validators/validate");
const order = require("../../controllers/customer/order");

const {
    createOrderSchema,
}=require("../../validators/order.schema");

router.post("/createOrder",auth,validate(createOrderSchema),order.createOrder);
router.get("/getOwnOrder",auth,order.getOwnOrder);
router.patch("/cancelledOrder/:id",auth,order.cancelledOrder);

module.exports = router;