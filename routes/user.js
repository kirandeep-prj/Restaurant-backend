const express = require("express");
const router = express.Router();

const user = require("../controllers/user");
const {registerSchema, loginSchema, updateSchema}=require ("../validators/user.schema")
const validate = require("../validators/validate");
const auth= require("../middleware/auth");

router.post("/register", validate(registerSchema), user.register);
router.post("/login", validate(loginSchema), user.login);
router.get("/me", auth, user.getMe);
router.patch("/updateme", auth, validate(updateSchema),user.updateMe);

module.exports=router;