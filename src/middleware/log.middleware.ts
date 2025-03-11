import { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger";

export const logMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(`${req.method} ${req.url}`);
  next();
};
