import { NextFunction, Request, Response } from "express";
import { ProductService } from "./product.service";
import { sendResponse } from "../../utils/sendResponse";
export const ProductController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ProductService.get(req.query);
      sendResponse(res, 200, response, "success retrieve all products");
    } catch (error) {
      next(error);
    }
  },
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ProductService.getById(req.params.id);
      sendResponse(res, 200, response, "success retrieve product");
    } catch (error) {
      next(error);
    }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ProductService.create(req.body);
      sendResponse(res, 201, response, "Suscess created product");
    } catch (error) {
      next(error);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ProductService.update(req.params.id, req.body);
      sendResponse(res, 200, response, "success Product updated");
    } catch (error) {
      next(error);
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await ProductService.delete(req.params.id);
      sendResponse(res, 200, response, "success Product deleted");
    } catch (error) {
      next(error);
    }
  },
};
