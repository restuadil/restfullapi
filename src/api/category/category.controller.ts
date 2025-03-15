import { NextFunction, Request, Response } from "express";
import { CategoryService } from "./category.service";
export const CategoryController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await CategoryService.get(req.query);
      res.status(200).json({
        status: true,
        statusCode: 200,
        data: response.response,
        pagination: response.pagination,
      });
    } catch (error) {
      next(error);
    }
  },
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await CategoryService.getById(req.params.id);
      res.status(200).json({
        status: true,
        statusCode: 200,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await CategoryService.create(req.body);
      res.status(201).json({
        status: true,
        statusCode: 201,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await CategoryService.update(req.params.id, req.body);
      res.status(200).json({
        status: true,
        statusCode: 200,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await CategoryService.delete(req.params.id);
      res.status(200).json({
        status: true,
        statusCode: 200,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
};
