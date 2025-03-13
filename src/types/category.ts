import { z } from "zod";
import { CategoryValidation } from "../api/category/category.validation";

export type CategoryRequest = z.infer<typeof CategoryValidation.CREATE>;

export type CategoryResponse = {
  id: string;
  name: string;
};
export type CategoryQuery = {
  search?: string;
  limit?: number;
  page?: number;
};
