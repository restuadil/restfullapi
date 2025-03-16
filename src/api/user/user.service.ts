import { Prisma } from "@prisma/client";
import {
  UserLogin,
  UserQuery,
  UserRequest,
  UserResetPassowrd,
  UserResponse,
} from "../../types/user";
import { Validation } from "../../utils/validation";
import { UserValidation } from "./user.validation";
import { prisma } from "../../config/prisma";
import { ResponseError } from "../../utils/response.error";
import { calculatePagination } from "../../utils/pagination";
import { pageAble } from "../../types/pagination";
import { compare, hashing } from "../../utils/hashing";

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
  getById: async (id: string): Promise<UserResponse> => {
    const response = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        address: true,
        avatar: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!response) throw new ResponseError(404, "User not found");
    return response;
  },
  create: async (data: UserRequest): Promise<UserResponse> => {
    const validateData = Validation.validate(
      UserValidation.CREATE,
      data
    ) as Required<UserRequest>;
    const existingUser = await prisma.user.findFirst({
      where: { email: validateData.email },
    });
    if (existingUser) throw new ResponseError(409, "Email already exists");

    const hashedPasswod = hashing(validateData.password);
    const response = await prisma.user.create({
      data: {
        ...validateData,
        password: hashedPasswod,
      },
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
  login: async (data: UserLogin): Promise<UserResponse> => {
    const validateData = Validation.validate(
      UserValidation.LOGIN,
      data
    ) as Required<UserLogin>;
    const user = await prisma.user.findFirst({
      where: { email: validateData.email },
    });
    if (!user) throw new ResponseError(401, "Invalid username or password");
    const isMatch = await compare(validateData.password, user.password);
    if (!isMatch) throw new ResponseError(401, "Invalid username or password");
    const response = {
      id: user.id,
      username: user.username,
      email: user.email,
      address: user.address,
      phone: user.phone,
    };
    return response;
  },
  resetPassword: async (
    id: string,
    data: UserResetPassowrd
  ): Promise<UserResponse> => {
    const validateData = Validation.validate(
      UserValidation.RESETPASSWORD,
      data
    ) as Required<UserResetPassowrd>;
    const user = await prisma.user.findFirst({
      where: { id },
    });
    if (!user) throw new ResponseError(404, "User not found");
    const isMatch = compare(validateData.password, user.password);
    if (!isMatch) throw new ResponseError(401, "Invalid current password");
    const hashedPasswod = hashing(validateData.newPassword);

    const response = await prisma.user.update({
      where: { id },
      data: { password: hashedPasswod },
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
};
