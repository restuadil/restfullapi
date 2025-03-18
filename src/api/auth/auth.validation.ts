import { z } from "zod";

export const AuthValidation = {
  REGISTER: z.object({
    email: z.string().email(),
    username: z.string().min(3),
    password: z.string().min(8),
    role: z.enum(["USER", "ADMIN"]).default("USER"),
    avatar: z.string().url().optional(),
    address: z.string().min(3).optional(),
    phone: z.string().optional(),
  }),
  LOGIN: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
  RESETPASSWORD: z.object({
    password: z.string(),
    newPassword: z.string().min(8),
  }),
};
