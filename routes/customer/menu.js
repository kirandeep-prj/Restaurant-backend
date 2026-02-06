const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const menu =require("../../controllers/customer/menu");

router.get("/getMenu",auth,menu.getAllAvailableItems);
router.get("/getSingleItem/:id",auth,menu.getSingleMenuItem );

module.exports = router;