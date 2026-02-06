const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
        required:true,
    },
    deliveryPartner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:String,
        enum:["assigned","picked","delivered"],
        default:"assigned"
    },
    pickedAt:Date,
    deliveredAt:Date
},{timestamps:true});

module.exports = mongoose.model("DeliveryTracking",deliverySchema);