import { Router } from "express";
import { validateIdMiddleware } from "../../middleware/id.middleware";
import { ProductController } from "./product.controller";
import { authorizationMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

export const ProductRouter = Router();
ProductRouter.use(authorizationMiddleware);

ProductRouter.route("/products")
  .get(ProductController.getAll)
  .post(roleMiddleware(["ADMIN"]), ProductController.create);

ProductRouter.route("/products/:id")
  .all(validateIdMiddleware)
  .get(ProductController.getById)
  .put(roleMiddleware(["ADMIN"]), ProductController.update)
  .delete(roleMiddleware(["ADMIN"]), ProductController.delete);
