import { Router } from "express";
import { userController } from "./auth.controller";

const router = Router();

router.post("/verification", userController.registerUser);
router.post("/register", userController.createUser);
// router.post("/login", loginUser);
// router.post("/", checkAuth, authenticateUser);
// router.post("/refreshAccessToken", authenticateByResfreshToken);
// router.post("/logout", logoutUser);

export { router as authRouter };
