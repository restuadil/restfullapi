import { z } from "zod";

export const CategoryValidation = {
  CREATE: z.object({
    name: z.string().min(1).max(50),
    description: z.string().min(1).max(255),
  }),
  UPDATE: z.object({
    id: z.string(),
    name: z.string().min(1).max(50),
    description: z.string().min(1).max(255),
  }),
  QUERY: z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(20),
  }),
};
