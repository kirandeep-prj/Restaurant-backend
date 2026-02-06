const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"name is required"],
            trim:true
        },

        Category:{
            type:String,
            required: [true,"Category is required"],
            trim:true
        },

        price:{
            type:Number,
            required:[true,"Price is required"],
            trim:true
        },
        isAvailable:{
            type:Boolean,
            required:[true,"Available items is required"],        },
        isVegetarian:{
            type:Boolean,
            required:[true,"Vegetarian field is required"]
        },
        preparationTime: {
            type:Number,
            required: [true, "Preparation time is required"],
            min:5
        },

        isDeleted:{
            type:Boolean,
            default:false
        },
        deletedAt:{
            type:Date,
            default:null
        }

    },
    {timestamps:true}
);

module.exports = mongoose.model("Menu",MenuSchema);