import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateIdMiddleware } from "../../middleware/id.middleware";
import { authorizationMiddleware } from "../../middleware/auth.middleware";

export const AuthRouter = Router();
AuthRouter.post("/login", AuthController.login);
AuthRouter.post("/register", AuthController.register);
AuthRouter.put(
  "/reset-password/:id",
  validateIdMiddleware,
  authorizationMiddleware,
  AuthController.resetPassword
);

AuthRouter.get(
  "/get-profile/:id",
  validateIdMiddleware,
  authorizationMiddleware,
  AuthController.getProfile
);
AuthRouter.post("/logout", AuthController.logout);
