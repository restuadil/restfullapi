import jwt from "jsonwebtoken";
import { env } from "../config/env";
export const JWT = {
  generateToken: (payload: {
    id: string;
    email: string;
    username: string;
    role: string;
  }): string => {
    return jwt.sign(payload, env.PRIVATE_KEY, {
      expiresIn: env.JWT_EXPIRATION_TIME,
      algorithm: "RS256",
    });
  },
  verifyToken: (
    token: string
  ): {
    id: string;
    email: string;
    username: string;
    role: string;
  } => {
    return jwt.verify(token, env.PUBLIC_KEY) as {
      id: string;
      email: string;
      username: string;
      role: string;
    };
  },
};
