import { Request, Response, NextFunction } from "express";
import { ResponseError } from "../utils/response.error";
import { AuthRequest } from "../types/user";

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role;
      if (!userRole) throw new ResponseError(403, "Invalid role");
      if (!allowedRoles.includes(userRole)) {
        throw new ResponseError(403, "Forbidden: You do not have permission");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
