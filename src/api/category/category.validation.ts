import { z } from "zod";

export const CategoryValidation = {
  CREATE: z.object({
    name: z.string().min(3).max(50),
  }),
  UPDATE: z.object({
    name: z.string().min(3).max(50),
  }),
  QUERY: z
    .object({
      search: z.string().optional(),
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(20),
    })
    .strict(),
};
