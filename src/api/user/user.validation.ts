import { z } from "zod";

export const UserValidation = {
  CREATE: z.object({
    email: z.string().email(),
    username: z.string().min(3),
    password: z.string().min(8),
    role: z.enum(["USER", "ADMIN"]).default("USER"),
    avatar: z.string().url().optional(),
    address: z.string().min(3).optional(),
    phone: z.string().optional(),
  }),
  UPDATE: z.object({
    username: z.string().min(3).optional(),
    role: z.enum(["USER", "ADMIN"]).default("USER").optional(),
    avatar: z.string().url().optional(),
    address: z.string().min(3).optional(),
    phone: z.string().optional(),
  }),
  LOGIN: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
  QUERY: z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
  RESETPASSWORD: z.object({
    password: z.string(),
    newPassword: z.string().min(8),
  }),
};
