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
  if (error instanceof ZodError) {
    logger.error(
      "Validation Error:",
      error.issues.map((issue) => ({
        code: issue.code,
        path: issue.path,
        message: issue.message,
      }))
    );
    const hasUnrecognizedKeys = error.issues.some(
      (issue) => issue.code === "unrecognized_keys"
    );
    if (hasUnrecognizedKeys) {
      res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid query parameters: Unrecognized keys are not allowed.",
      });
    } else {
      const errorMessages = error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      );
      res.status(400).json({
        success: false,
        statusCode: 400,
        message: `Validation Error: ${errorMessages.join("; ")}`,
      });
    }
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Name already exists. Please choose a different name.",
      });
    } else {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: `Database Error : ${JSON.stringify(error.message)}`,
      });
    }
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
