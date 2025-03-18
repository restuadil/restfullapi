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

    const where: Prisma.ProductWhereInput = {
      name: search ? { contains: search, mode: "insensitive" } : undefined,
      categories: category ? { some: { categoryId: category } } : undefined,
    };

    const totalCount = await prisma.product.count({ where });
    if (totalCount < 1) throw new ResponseError(404, "data not found");
    const pagination = calculatePagination(totalCount, page, limit);

    const product = await prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        images: true,
        categories: { select: { category: { select: { name: true } } } },
      },
    });

    if (product.length === 0)
      throw new ResponseError(404, `No data available on page ${page}`);

    const response = product.map((product) => ({
      ...product,
      categories: product.categories.map((c) => c.category.name),
    }));

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
  create: async (data: ProductRequest): Promise<ProductResponse> => {
    const validateData = Validation.validate(
      ProductValidation.CREATE,
      data
    ) as Required<ProductRequest>;

    const product = await prisma.product.create({
      data: {
        name: validateData.name,
        description: validateData.description,
        price: validateData.price,
        stock: validateData.stock,
        images: validateData.images,
        categories: {
          create: validateData.categoryIds?.map((categoryId) => ({
            category: { connect: { id: categoryId } },
          })),
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        images: true,
        categories: { select: { category: { select: { name: true } } } },
      },
    });
    return {
      ...product,
      categories: product.categories.map((c) => c.category.name),
    };
  },
  update: async (
    id: string,
    data: ProductRequest
  ): Promise<ProductResponse> => {
    // Validasi data input
    const validateData = Validation.validate(
      ProductValidation.UPDATE,
      data
    ) as Required<ProductRequest>;

    return prisma.$transaction(async (tx) => {
      // Ambil kategori yang sudah terhubung dengan produk
      const existingCategories = await tx.productCategory.findMany({
        where: { productId: id },
        select: { categoryId: true },
      });

      const existingCategoryIds = existingCategories.map((ec) => ec.categoryId);

      // Kategori yang perlu dihapus (tidak ada di data baru)
      const categoriesToDelete = existingCategoryIds.filter(
        (categoryId) => !validateData.categoryIds?.includes(categoryId)
      );

      // Kategori yang perlu ditambahkan (tidak ada di data lama)
      const categoriesToAdd = validateData.categoryIds?.filter(
        (categoryId) => !existingCategoryIds.includes(categoryId)
      );

      // Update produk dan relasi many-to-many
      const product = await tx.product.update({
        where: { id },
        data: {
          name: validateData.name,
          description: validateData.description,
          price: validateData.price,
          stock: validateData.stock,
          images: validateData.images,
          categories: {
            // Hapus relasi yang tidak diperlukan
            deleteMany: categoriesToDelete.map((categoryId) => ({
              categoryId,
            })),
            // Tambahkan relasi baru
            create: categoriesToAdd?.map((categoryId) => ({
              category: { connect: { id: categoryId } },
            })),
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          stock: true,
          images: true,
          categories: { select: { category: { select: { name: true } } } },
        },
      });

      return {
        ...product,
        categories: product.categories.map((c) => c.category.name),
      };
    });
  },
  delete: async (id: string): Promise<ProductResponse> => {
    const existingProduct = await prisma.product.findFirst({
      where: { id },
    });
    if (!existingProduct) throw new ResponseError(404, "Product not found");
    const deletedProduct = await prisma.product.delete({
      where: { id },
      include: {
        categories: {
          select: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    const response = {
      ...deletedProduct,
      categories: deletedProduct.categories.map((c) => c.category.name),
    };
    return response;
  },
};
