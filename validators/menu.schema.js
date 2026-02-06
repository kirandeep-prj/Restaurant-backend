const {z} = require("zod");

exports.createMenuSchema = z.object({
    name:z.string().min(1,"Name is required"),
    Category: z.string().min(1,"Category is required"),
   price: z.number().int("Price must be an integer").min(100, "Price must be at least ₹1")
});