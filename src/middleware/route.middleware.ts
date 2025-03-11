import { Request, Response } from "express";
import { logger } from "../config/logger";

export const routeMiddleware = (req: Request, res: Response) => {
  logger.error(`Route : ${req.path} is not a valid`);
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Route not found",
  });
};
