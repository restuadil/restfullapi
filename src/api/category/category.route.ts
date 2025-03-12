import { Router } from "express";
import { CategoryController } from "./category.controller";
import { validateIdMiddleware } from "../../middleware/id.middleware";
import { CategoryValidation } from "./category.validation";

export const CategoryRouter = Router();
CategoryRouter.get("/category", CategoryController.get);
CategoryRouter.post("/category", CategoryController.create);
CategoryRouter.get(
  "/category/:id",
  validateIdMiddleware,
  CategoryController.get
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
