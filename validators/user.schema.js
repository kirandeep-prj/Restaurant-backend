const {z} = require("zod");

exports.registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .regex(
      /^[a-z]+@[a-z]+\.(com)$/,
      "Email must be in format abc@gmail.com"
    ),

  phonenumber: z
    .string()
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
});


exports.loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password:z.string().min(6,"password must be atleast 6 digit")
});

exports.updateSchema = z.looseObject({
  name:z.string().min(2,"Name must be at least 2 characters"),
  phonenumber: z.string().length(10,"Phone must have exact 10 digits")
})
