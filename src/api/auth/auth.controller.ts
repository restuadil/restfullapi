import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";

export const AuthController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await AuthService.register(req.body);
      sendResponse(res, 200, response, "success register");
    } catch (error) {
      next(error);
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await AuthService.login(req.body);
      sendResponse(res, 200, response, "success login");
    } catch (error) {
      next(error);
    }
  },
  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await AuthService.logout(req);
      sendResponse(res, 200, response, "success logout");
    } catch (error) {
      next(error);
    }
  },
  resetPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await AuthService.resetPassword(req.params.id, req.body);
      sendResponse(res, 200, response, "success reset password");
    } catch (error) {
      next(error);
    }
  },
  getProfile: async (req: Request, res: Response, next: NextFunction) => {
    const response = await AuthService.getProfile(req.params.id);
    sendResponse(res, 200, response, "success retrieve profile");
  },
};
