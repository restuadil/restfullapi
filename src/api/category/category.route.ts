import { Router } from "express";
import { CategoryController } from "./category.controller";
import { validateId } from "../../middleware/id.middleware";

export const CategoryRouter = Router();
CategoryRouter.get("/category", CategoryController.get);
CategoryRouter.get("/category/:id", validateId, CategoryController.get);
