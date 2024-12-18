import { Router } from "express";

import { asyncHandler } from "@/utils/asyncHandler";

import { checkAuth } from "../middleware";
import { profileController } from "./profile.controller";

const router = Router();
router.use(checkAuth);
router.get("/", asyncHandler(profileController.getProfile));
export { router as profileRouter };