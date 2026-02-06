const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderNumber: {
      type: String,
      unique: true,
      default: () =>
      `ORD${Date.now()}${Math.random().toString(36).slice(2, 4).toUpperCase()}`,
    },
    items: {
      type: [
        {
          menuItemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu",
            required: [true, "Item is required"],
          },

          itemName: {
            type: String,
            required: true,
          },

          itemPrice: {
            type: Number,
            required: true,
          },

          quantity: {
            type: Number,
            default: 1,
            min: [1, "Quantity must be at least 1"],
          },

          subtotal: {
            type: Number,
            required: true,
          },
        },
      ],
      validate: [
        (val) => val.length > 0,
        "At least one item is required",
      ],
    },

    totalAmount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },

    finalAmount: {
      type: Number,
      required: true,
    },


    deliveryAddress: {
      street: {
        type: String,
        minlength: 2,
        trim: true,
        required: [true, "Address is required"],
      },
      city: {
        type: String,
        minlength: 1,
        trim: true,
        required: [true, "City is required"],
      },
      pincode: {
        type: String,
        match: [/^\d{6}$/, "Pincode must be exactly 6 digits"],
        required: [true, "Pincode is required"],
      },
    },
    TotalPreparationTime:{
      type:Number,
      required: [true, "Total Preparation time is required"],
      min:5
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "online"],
      default: "cash",
      required: true,
    },

    specialInstructions: {
      type: String,
      trim: true,
      default: "",
    },
    estimatedDeliveryTime:{
      type:Number,
      required: [true, "Estimated Delivery time is required"],
      min:20
    },
    status:{
      type:String,
      enum:["pending" , "confirmed", "preparing", "ready","out_for_delivery", "delivered", "cancelled"],
      default:"pending"
    },
    paymentStatus:{
      type:String,
      enum:["pending", "paid", "failed"],
      default:"pending"
    },
    assignedAt:{
      type:Date,
      default:null
    },
    deliveryPartner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },
    
    cancellationReason:{
      type:String,
      default:"",
    },
    pickedAt:{
      type:Date,
      default:null
    },
    deliveredAt:{
      type:Date,
      default:null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
