const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique:true,
        lowercase: true,
        trim: true
    },

    phonenumber: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^\d{10}$/, "PhoneNumber must be exactly 10 digits"],
        trim:true
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
      trim:true
    },

    role: {
      type: String,
      enum: ["customer","staff","deliveryPartner"],
      default: "customer",
    },
  },
  { timestamps: true }
);


// Hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});


module.exports = mongoose.model("User", userSchema);
