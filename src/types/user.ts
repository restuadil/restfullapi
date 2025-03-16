import { z } from "zod";
import { UserValidation } from "../api/user/user.validation";

export type UserRequest = z.infer<typeof UserValidation.CREATE>;
export type UserResponse = {
  id: string;
  username: string;
  email: string;
  address: string | null;
  phone: string | null;
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
