import { NextFunction, Request, Response } from "express";
import { CategoryService } from "./category.service";
import { sendResponse } from "../../utils/sendResponse";
export const CategoryController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await CategoryService.get(req.query);
      sendResponse(res, 200, response, "Success retrived all categories");
    } catch (error) {
      next(error);
    }
  },
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await CategoryService.getById(req.params.id);
      sendResponse(res, 200, response, "Success retrieving category");
    } catch (error) {
      next(error);
    }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await CategoryService.create(req.body);
      sendResponse(res, 201, response, "Success Created Category");
    } catch (error) {
      next(error);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await CategoryService.update(req.params.id, req.body);
      sendResponse(res, 200, response, "Success Update Category");
    } catch (error) {
      next(error);
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await CategoryService.delete(req.params.id);
      sendResponse(res, 200, response, "Success Delete Cateogory");
    } catch (error) {
      next(error);
    }
  },
};
