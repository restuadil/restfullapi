import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
export const UserController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await UserService.get(req.query);
      sendResponse(res, 200, response, "success retrieve all users");
    } catch (error) {
      next(error);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await UserService.update(req.params.id, req.body);
      sendResponse(res, 200, response, "success update user");
    } catch (error) {
      next(error);
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await UserService.delete(req.params.id);
      sendResponse(res, 200, response, "success delete user");
    } catch (error) {
      next(error);
    }
  },
};
