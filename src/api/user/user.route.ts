import { Router } from "express";
import { validateIdMiddleware } from "../../middleware/id.middleware";
import { UserController } from "./user.controller";

export const UserRouter = Router();
UserRouter.get("/user", UserController.getAll);
UserRouter.get("/user/:id", validateIdMiddleware, UserController.getById);
UserRouter.get("/user/:id", validateIdMiddleware, UserController.getById);
UserRouter.put("/user/:id", validateIdMiddleware, UserController.update);
UserRouter.delete("/user/:id", validateIdMiddleware, UserController.delete);

UserRouter.post("/user/register", UserController.create);
UserRouter.post("/user/login", UserController.login);
UserRouter.put(
  "/user/reset-password/:id",
  validateIdMiddleware,
  UserController.resetPassword
);
