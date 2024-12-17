import { Router } from "express";
import { userController } from "./auth.controller";
import { asyncHandler } from "@/utils/asyncHandler";
import passport from "passport";
import { checkAuth } from "../middleware";

const router = Router();

router.get("/", checkAuth, asyncHandler(userController.authenticateUser));
router.post("/verification", asyncHandler(userController.registerUser));
router.get("/register", asyncHandler(userController.createUser));
router.post("/login", asyncHandler(userController.loginUser));
router.post("/logout", asyncHandler(userController.logoutUser));
router.post(
  "/refreshAccessToken",
  asyncHandler(userController.authenticateByResfreshToken)
);
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  asyncHandler(userController.authenticate_github)
);

export { router as authRouter };
