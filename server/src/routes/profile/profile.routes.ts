import { Router } from "express";

import { asyncHandler } from "@/utils/asyncHandler";

import { checkAuth } from "../middleware";
import { profileController } from "./profile.controller";

const router = Router();
router.use(checkAuth);
router.get("/", asyncHandler(profileController.getProfile));
router.put("/edit", asyncHandler(profileController.editProfile));
router.post("/readme-handler", asyncHandler(profileController.readmeHandler));
router.put("/update-streak", asyncHandler(profileController.updateStreak));
export { router as profileRouter };
