import { z } from "zod";

export const ProductValidation = {
  CREATE: z.object({
    name: z
      .string()
      .min(1, { message: "Name is requird" })
      .max(50, { message: "Name must be less than 50 characters" }),
    description: z.string().min(1, { message: "Description is Required" }),
    price: z.number().min(0, { message: "Price must be positive number" }),
    stock: z.number().min(0, { message: "stock must be positive number" }),
    images: z
      .string()
      .url({ message: "Images must be valid urls" })
      .array()
      .nonempty({ message: "At least one image is required" }),
    categoryIds: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid category ID format" })
      .array()
      .optional(),
  }),
  UPDATE: z.object({
    name: z.string().min(1).max(50).optional(),
    description: z.string().min(1).max(255).optional(),
    price: z.number().min(0).optional(),
    stock: z.number().min(0).optional(),
    images: z.string().array().optional(),
    categoryId: z.string().optional(),
  }),
  QUERY: z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(20),
    categoryId: z.string().optional(),
  }),
};
