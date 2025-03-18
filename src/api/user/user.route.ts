import { Router } from "express";
import { validateIdMiddleware } from "../../middleware/id.middleware";
import { UserController } from "./user.controller";
import { authorizationMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

export const UserRouter = Router();
UserRouter.use(authorizationMiddleware);

UserRouter.route("/users").get(
  roleMiddleware(["ADMIN"]),
  UserController.getAll
);

UserRouter.route("/users/:id")
  .all(validateIdMiddleware)
  .put(UserController.update)
  .delete(UserController.delete);
