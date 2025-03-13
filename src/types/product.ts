import { z } from "zod";
import { ProductValidation } from "../api/product/product.validation";
import { Category } from "@prisma/client";

export type ProductRequest = z.infer<typeof ProductValidation.CREATE>;

export type ProductResponse = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categories: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type ProductQuery = {
  search?: string;
  limit?: number;
  page?: number;
  category?: string;
};
