import { Prisma } from "@prisma/client";
import { CategoryQuery, CategoryResponse } from "../../types/category";
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
    const totalCount = await prisma.category.count({ where });
    const pagination = calculatePagination(totalCount, page, limit);

    const response = await prisma.category.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    return { response, pagination };
  },
  getById: async (id: string): Promise<CategoryResponse> => {
    const response = await prisma.category.findUnique({
      where: { id },
    });
    if (!response) throw new ResponseError(404, "Category not found");
    return response;
  },
  create: async () => {},
  update: async () => {},
  delete: async () => {},
};
