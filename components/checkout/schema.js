import { z } from "zod";

export const CheckoutSchema = z.object({
  fullName: z.string().min(1, "Please enter your full name").trim(),
  email: z
    .email("Please enter a valid email address")
    .min(1, "Please enter a valid email address")
    .trim(),
  phone: z.string().min(1, "Please enter a valid phone number").trim(),
  address: z.string().min(1, "Please enter your delivery address").trim(),
  city: z.string().min(1, "Please enter your city").trim(),
  state: z.string().min(1, "Please select your state"),
  deliveryNote: z.string().trim().optional(),
});
