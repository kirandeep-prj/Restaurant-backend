const express = require("express");
const report= require("../../controllers/staff/report");
const auth = require("../../middleware/auth");
const restrictTo = require("../../middleware/restrictTo");
const router = express.Router();

router.get("/order-counts",auth,restrictTo("staff"),report.getOrderCounts);
router.get("/export/csv",auth,restrictTo("staff"),report.exportCSV);

module.exports=router;