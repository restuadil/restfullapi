import { Prisma } from "@prisma/client";
import { pageAble } from "../../types/pagination";
import {
  ProductQuery,
  ProductRequest,
  ProductResponse,
} from "../../types/product";
import { Validation } from "../../utils/validation";
import { ProductValidation } from "./product.validation";
import { prisma } from "../../config/prisma";
import { ResponseError } from "../../utils/response.error";
import { calculatePagination } from "../../utils/pagination";

export const ProductService = {
  get: async (query?: ProductQuery): Promise<pageAble<ProductResponse>> => {
    const validateQuery = Validation.validate(
      ProductValidation.QUERY,
      query ?? {}
    ) as Required<ProductQuery>;
    const { search, page, limit, category } = validateQuery;
    const where: Prisma.ProductWhereInput = {};
    if (search) where.name = { contains: search, mode: "insensitive" };
    if (category) where.categories = { some: { categoryId: category } };
    const totalCount = await prisma.product.count({ where });
    if (totalCount < 1) throw new ResponseError(404, "data not found");
    const pagination = calculatePagination(totalCount, page, limit);

    const product = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        categories: {
          select: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        images: true,
      },
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    const response = product.map((product) => ({
      ...product,
      categories: product.categories.map((c) => c.category.name),
    }));
    if (response.length === 0)
      throw new ResponseError(404, `No data available on page ${page}`);
    return { response, pagination };
  },
  getById: async (id: string): Promise<ProductResponse> => {
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        categories: {
          select: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        images: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!product) throw new ResponseError(404, "Product not found");
    const response = {
      ...product,
      categories: product.categories.map((c) => c.category.name),
    };
    return response;
  },
  create: async (data: ProductRequest) => {
    const validateData = Validation.validate(
      ProductValidation.CREATE,
      data
    ) as Required<ProductRequest>;
    const newProduct = await prisma.product.create({
      data: {
        name: validateData.name,
        description: validateData.description,
        price: validateData.price,
        stock: validateData.stock,
        images: validateData.images,
      },
    });
    if (validateData.categoryIds && validateData.categoryIds.length > 0) {
      await prisma.productCategory.createMany({
        data: validateData.categoryIds.map((categoryId) => ({
          productId: newProduct.id,
          categoryId,
        })),
      });
    }
    return newProduct;
  },
  update: async () => {},
  delete: async () => {},
};
