import { z } from "zod";
import { UserValidation } from "../api/user/user.validation";
import { AuthValidation } from "../api/auth/auth.validation";
import { Request } from "express";

export type UserRequest = z.infer<typeof AuthValidation.REGISTER>;
export type UserResponse = {
  id: string;
  username: string;
  email: string;
  address: string | null;
  phone: string | null;
  token?: string;
};

export type UserLogin = {
  email: string;
  password: string;
};
export type UserQuery = {
  search?: string;
  limit?: number;
  page?: number;
};

export type UserResetPassowrd = {
  password: string;
  newPassword: string;
};

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
}
