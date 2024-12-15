import { Router } from "express";
import { userController } from "./auth.controller";
import { asyncHandler } from "@/utils/asyncHandler";
import { passport } from "../../utils/passport";

const router = Router();

router.post("/verification", asyncHandler(userController.registerUser));
router.get("/register", asyncHandler(userController.createUser));
router.post("/login", asyncHandler(userController.loginUser));
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
// router.post("/google", asyncHandler(userController.loginUser));
// router.post("/", checkAuth, authenticateUser);
// router.post("/refreshAccessToken", authenticateByResfreshToken);
// router.post("/logout", logoutUser);

export { router as authRouter };
