import { hash, compare } from "bcrypt";
import { env } from "../config/env";
export const hashing = async (password: string): Promise<string> => {
  return await hash(password, env.BCRYPT_SALT);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await compare(password, hash);
};
