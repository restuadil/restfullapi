import { NextFunction, Response } from "express";
import { ResponseError } from "../utils/response.error";
import { JWT } from "../utils/jwt";
import { AuthRequest } from "../types/user";
import { logger } from "../config/logger";

export const authorizationMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) throw new ResponseError(401, "Unauthorized");

    const decoded = JWT.verifyToken(token);

    req.user = decoded;
    logger.info(`User ${req.user} accessed the resource`);
    next();
  } catch (error) {
    logger.error(error);
    res.status(401).json({
      success: false,
      statusCode: 401,
      message: "Unauthorized",
    });
  }
};
