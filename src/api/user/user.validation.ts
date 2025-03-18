import { z } from "zod";

export const UserValidation = {
  UPDATE: z.object({
    username: z.string().min(3).optional(),
    role: z.enum(["USER", "ADMIN"]).default("USER").optional(),
    avatar: z.string().url().optional(),
    address: z.string().min(3).optional(),
    phone: z.string().optional(),
  }),
  QUERY: z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
};
