const { z } = require("zod");

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

exports.createOrderSchema = z.object({
  items: z.array(
    z.object({
      menuItemId: objectId,
      quantity: z.number().int().positive().default(1),
    })
  ).min(1, "At least one item is required"),

  deliveryAddress: z.object({
    street: z.string().min(2, "Street is required"),
    city: z.string().min(1, "City is required"),
    pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  }),

  paymentMethod: z.enum(["cash", "online"]).default("cash"),

  specialInstructions: z.string().optional(),
  cancellationReason: z.string().optional(),
});
