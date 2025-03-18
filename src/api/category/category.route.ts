import { Router } from "express";
import { CategoryController } from "./category.controller";
import { validateIdMiddleware } from "../../middleware/id.middleware";
import { authorizationMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

export const CategoryRouter = Router();

CategoryRouter.use(authorizationMiddleware);

CategoryRouter.route("/categories")
  .get(CategoryController.getAll)
  .post(roleMiddleware(["ADMIN"]), CategoryController.create);

CategoryRouter.route("/categories/:id")
  .all(validateIdMiddleware)
  .get(CategoryController.getById)
  .put(roleMiddleware(["ADMIN"]), CategoryController.update)
  .delete(roleMiddleware(["ADMIN"]), CategoryController.delete);
