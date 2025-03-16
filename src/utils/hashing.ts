import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
export const hashing = (password: string): string => {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);
  return hash;
};

export const compare = (password: string, hash: string): boolean => {
  return compareSync(password, hash);
};
