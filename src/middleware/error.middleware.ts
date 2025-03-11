import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger";
import { ResponseError } from "../utils/response.error";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(error);
  if (error instanceof ZodError) {
    const messages = error.issues.map((issue) => issue.message);
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: `Validation Error : ${messages}`,
    });
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: `Database Error : ${JSON.stringify(error.message)}`,
    });
  } else if (error instanceof ResponseError) {
    res.status(500).json({
      success: false,
      statusCode: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
};
