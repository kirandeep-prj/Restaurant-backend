require ("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();

const user= require("./routes/user");
const menu = require("./routes/staff/menu");
const mainMenu = require("./routes/customer/menu");
const order = require("./routes/customer/order")
const connectDB = require("./config/db");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const errorHandler = require("./middleware/errorHandler");
const staffOrder = require("./routes/staff/order");
const delivery = require("./routes/delivery/order");

connectDB();

app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/user", user);
app.use("/api/menu/staff", menu);
app.use("/api/menu", mainMenu);
app.use("/api/order",order);
app.use("/api/order/staff",staffOrder);
app.use("/api/order/delivery",delivery);

app.get("/", (req, res) => {
  res.send("Restaurant API running (clean structure)");
});

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
