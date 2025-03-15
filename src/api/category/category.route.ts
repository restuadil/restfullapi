import { Router } from "express";
import { CategoryController } from "./category.controller";
import { validateIdMiddleware } from "../../middleware/id.middleware";

export const CategoryRouter = Router();
CategoryRouter.get("/category", CategoryController.getAll);
CategoryRouter.post("/category", CategoryController.create);
CategoryRouter.get(
  "/category/:id",
  validateIdMiddleware,
  CategoryController.getById
);
CategoryRouter.put(
  "/category/:id",
  validateIdMiddleware,
  CategoryController.update
);
CategoryRouter.delete(
  "/category/:id",
  validateIdMiddleware,
  CategoryController.delete
);
