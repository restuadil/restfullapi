import { Prisma } from "@prisma/client";
import { UserQuery, UserRequest, UserResponse } from "../../types/user";
import { Validation } from "../../utils/validation";
import { UserValidation } from "./user.validation";
import { prisma } from "../../config/prisma";
import { ResponseError } from "../../utils/response.error";
import { calculatePagination } from "../../utils/pagination";
import { pageAble } from "../../types/pagination";

export const UserService = {
  get: async (query?: UserQuery): Promise<pageAble<UserResponse>> => {
    const validateQuery = Validation.validate(
      UserValidation.QUERY,
      query
    ) as Required<UserQuery>;
    const { page, limit, search } = validateQuery;
    const where: Prisma.UserWhereInput = {
      username: search ? { contains: search, mode: "insensitive" } : undefined,
      email: search ? { contains: search, mode: "insensitive" } : undefined,
    };

    const totalCount = await prisma.user.count({
      where,
    });
    if (totalCount < 1) throw new ResponseError(404, "data not found");
    const pagination = calculatePagination(totalCount, page, limit);

    const response = await prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        username: true,
        email: true,
        address: true,
        phone: true,
      },
    });
    return { response, pagination };
  },
  update: async (id: string, data: UserRequest): Promise<UserResponse> => {
    const validateData = Validation.validate(
      UserValidation.UPDATE,
      data
    ) as Required<UserRequest>;
    const existingUser = await prisma.user.findFirst({
      where: { id },
    });
    if (!existingUser) throw new ResponseError(404, "User not found");

    const response = await prisma.user.update({
      where: { id },
      data: validateData,
      select: {
        id: true,
        username: true,
        email: true,
        address: true,
        phone: true,
      },
    });
    return response;
  },
  delete: async (id: string) => {
    const existingUser = await prisma.user.findFirst({
      where: { id },
    });
    if (!existingUser) throw new ResponseError(404, "User not found");
    await prisma.user.delete({
      where: { id },
    });
    return true;
  },
};
