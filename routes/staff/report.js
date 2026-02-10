const express = require("express");
const report= require("../../controllers/staff/report");
const auth = require("../../middleware/auth");
const restrictTo = require("../../middleware/restrictTo");
const router = express.Router();

router.get("/order-counts",auth,restrictTo("staff"),report.getOrderCounts);
router.get("/menu-counts",auth,restrictTo("staff"),report.getMenuCount);
router.get("/user-counts",auth,restrictTo("staff"),report.getUserCount);
router.get("/export/order/csv",auth,restrictTo("staff"),report.exportOrderCSV);
router.get("/export/menu/csv",auth,restrictTo("staff"),report.exportMenuCSV);
router.get("/export/user/csv",auth,restrictTo("staff"),report.exportUserCSV);

module.exports=router;