const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const validate = require("../../validators/validate");
const restrictTo = require("../../middleware/restrictTo");
const menu =require("../../controllers/staff/menu");

const {
    createMenuSchema,
}=require("../../validators/menu.schema");

router.post("/createMenu",auth,validate(createMenuSchema),restrictTo("staff"),menu.addItem);
router.get("/getAllItems",auth,restrictTo("staff"),menu.getAllItems);
router.patch("/updateMenu/:id",auth,validate(createMenuSchema),restrictTo("staff"),menu.updateItem);
router.delete("/deleteItem/:id",auth,restrictTo("staff"),menu.softDeleteItem);
router.patch("/restoreItem/:id",auth,restrictTo("staff"),menu.restoreMenuItem );
router.patch("/isAvailable/:id",auth,restrictTo("staff"),menu.toggleAvailable );

module.exports = router;