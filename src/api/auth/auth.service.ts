import { logger } from "../../config/logger";
import { prisma } from "../../config/prisma";
import {
  UserLogin,
  UserRequest,
  UserResetPassowrd,
  UserResponse,
} from "../../types/user";
import { comparePassword, hashing } from "../../utils/hashing";
import { JWT } from "../../utils/jwt";
import { ResponseError } from "../../utils/response.error";
import { Validation } from "../../utils/validation";
import { AuthValidation } from "./auth.validation";

export const AuthService = {
  register: async (data: UserRequest): Promise<UserResponse> => {
    const validateData = Validation.validate(
      AuthValidation.REGISTER,
      data
    ) as Required<UserRequest>;
    const existingUser = await prisma.user.findFirst({
      where: { email: validateData.email },
    });
    if (existingUser) throw new ResponseError(409, "Email already exists");

    const hashedPassword = await hashing(validateData.password);
    const response = await prisma.user.create({
      data: {
        ...validateData,
        password: hashedPassword,
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
  login: async (data: UserLogin): Promise<UserResponse> => {
    const validateData = Validation.validate(
      AuthValidation.LOGIN,
      data
    ) as Required<UserLogin>;
    const user = await prisma.user.findFirst({
      where: { email: validateData.email },
    });
    if (!user) throw new ResponseError(401, "Invalid username or password");
    const isMatch = await comparePassword(validateData.password, user.password);
    if (!isMatch) throw new ResponseError(401, "Invalid username or password");

    const token = JWT.generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
    const response = {
      id: user.id,
      username: user.username,
      email: user.email,
      address: user.address,
      phone: user.phone,
      token: token,
    };
    return response;
  },
  getProfile: async (id: string): Promise<UserResponse> => {
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
  resetPassword: async (
    id: string,
    data: UserResetPassowrd
  ): Promise<UserResponse> => {
    const validateData = Validation.validate(
      AuthValidation.RESETPASSWORD,
      data
    ) as Required<UserResetPassowrd>;
    const user = await prisma.user.findFirst({
      where: { id },
    });
    if (!user) throw new ResponseError(404, "User not found");
    const isMatch = await comparePassword(validateData.password, user.password);
    if (!isMatch) throw new ResponseError(401, "Invalid current password");
    const hashedPassword = await hashing(validateData.newPassword);

    const response = await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
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
  logout: async (user: any) => {
    logger.info(`Logged out ${user}`);
  },
};
