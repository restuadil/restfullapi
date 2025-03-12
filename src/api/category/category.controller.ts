import { NextFunction, Request, Response } from "express";
import { CategoryService } from "./category.service";
export const CategoryController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.params.id) {
        const response = await CategoryService.getById(req.params.id);
        res.status(200).json({
          status: true,
          statusCode: 200,
          data: response,
        });
      } else if (req.query) {
        const response = await CategoryService.get(req.query);
        res.status(200).json({
          status: true,
          statusCode: 200,
          data: response.response,
          pagination: response.pagination,
        });
      } else {
        const response = await CategoryService.get();
        res.status(200).json({
          status: true,
          statusCode: 200,
          data: response.response,
          pagination: response.pagination,
        });
      }
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
