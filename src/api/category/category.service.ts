import { Prisma } from "@prisma/client";
import {
  CategoryQuery,
  CategoryRequest,
  CategoryResponse,
} from "../../types/category";
import { pageAble } from "../../types/pagination";
import { Validation } from "../../utils/validation";
import { CategoryValidation } from "./category.validation";
import { prisma } from "../../config/prisma";
import { calculatePagination } from "../../utils/pagination";
import { ResponseError } from "../../utils/response.error";

export const CategoryService = {
  get: async (query?: CategoryQuery): Promise<pageAble<CategoryResponse>> => {
    const validatedQuery = Validation.validate(
      CategoryValidation.QUERY,
      query ?? {}
    ) as Required<CategoryQuery>;

    const { search, page, limit } = validatedQuery;
    const where: Prisma.CategoryWhereInput = {};
    if (search) where.name = { contains: search, mode: "insensitive" };
    const totalCount = await prisma.category.count({
      where,
    });
    if (totalCount < 1) throw new ResponseError(404, "data not found");
    const pagination = calculatePagination(totalCount, page, limit);

    const response = await prisma.category.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    if (response.length === 0) {
      throw new ResponseError(404, `No data available on page ${page}`);
    }
    return { response, pagination };
  },
  getById: async (id: string): Promise<CategoryResponse> => {
    const response = await prisma.category.findUnique({
      where: { id },
    });
    if (!response) throw new ResponseError(404, "Category not found");
    return response;
  },
  create: async (data: CategoryRequest): Promise<CategoryResponse> => {
    const validatedData = Validation.validate(
      CategoryValidation.CREATE,
      data
    ) as Required<CategoryRequest>;

    const existingData = await prisma.category.findFirst({
      where: { name: validatedData.name },
    });
    if (existingData) throw new ResponseError(409, "Category already exists");
    const response = await prisma.category.create({
      data: validatedData,
    });
    return response;
  },
  update: async (
    id: string,
    data: CategoryRequest
  ): Promise<CategoryResponse> => {
    const validatedData = Validation.validate(
      CategoryValidation.UPDATE,
      data
    ) as Required<CategoryRequest>;
    const existingData = await prisma.category.findFirst({
      where: { id },
    });
    if (!existingData) throw new ResponseError(404, "Category not found");
    if (existingData && existingData.id !== id)
      throw new ResponseError(404, "Category already exists");
    const response = await prisma.category.update({
      where: { id },
      data: validatedData,
    });
    return response;
  },
  delete: async (id: string): Promise<CategoryResponse> => {
    const existingData = await prisma.category.findFirst({
      where: { id },
    });
    if (!existingData) throw new ResponseError(404, "Category not found");
    const response = await prisma.category.delete({ where: { id } });
    return response;
  },
};
