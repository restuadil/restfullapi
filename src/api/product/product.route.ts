import { Router } from "express";
import { validateIdMiddleware } from "../../middleware/id.middleware";
import { ProductController } from "./product.controller";

export const ProductRouter = Router();
ProductRouter.get("/product", ProductController.getAll);
ProductRouter.post("/product", ProductController.create);
ProductRouter.get(
  "/product/:id",
  validateIdMiddleware,
  ProductController.getById
);
ProductRouter.put(
  "/product/:id",
  validateIdMiddleware,
  ProductController.update
);
ProductRouter.delete(
  "/product/:id",
  validateIdMiddleware,
  ProductController.delete
);
