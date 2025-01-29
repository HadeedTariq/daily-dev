import { Router } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { checkAuth } from "../middleware";
import { followersController } from "./followers.controller";

const router = Router();

router.use(checkAuth);
router.put("/follow", asyncHandler(followersController.followUser));
router.put("/unfollow", asyncHandler(followersController.unfollowUser));

router.get("/my-followers", asyncHandler(followersController.getFollowers));
router.get(
  "/user-followers",
  asyncHandler(followersController.getUserFollowers)
);

router.get("/my-followings", asyncHandler(followersController.getFollowing));
router.get(
  "/user-followings",
  asyncHandler(followersController.getUserFollowing)
);
router.get(
  "/followings-posts",
  asyncHandler(followersController.getFollowingsPosts)
);
router.get(
  "/notifications",
  asyncHandler(followersController.getNotifications)
);
router.put(
  "/read-notifications",
  asyncHandler(followersController.updateNotificationStatus)
);

export { router as followersRouter };
