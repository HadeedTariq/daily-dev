import { Router } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { checkAuth } from "../middleware";
import { followersController } from "./followers.controller";

const router = Router();

router.use(checkAuth);
router.post("/follow", asyncHandler(followersController.followUser));
router.delete("/unfollow", asyncHandler(followersController.unfollowUser));
router.get("/my-followers", asyncHandler(followersController.getFollowers));
router.get("/my-followings", asyncHandler(followersController.getFollowing));
router.get(
  "/:userId/notifications",
  asyncHandler(followersController.getNotifications)
);

export { router as followersRouter };
