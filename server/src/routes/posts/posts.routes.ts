import { Router } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { checkAuth } from "../middleware";
import { postController } from "./posts.controller";

const router = Router();

router.use(checkAuth);
router.get("/", asyncHandler(postController.getPosts));
router.get("/tags", asyncHandler(postController.getPostsTags));
router.post("/create", asyncHandler(postController.createPost));
router.post("/create-tag", asyncHandler(postController.createTag));
router.put("/:postId", asyncHandler(postController.editPost));
router.delete("/:postId", asyncHandler(postController.deletePost));

export { router as postRouter };
