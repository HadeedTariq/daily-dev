import { Router } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { checkAuth } from "../middleware";
import { postController } from "./posts.controller";

const router = Router();

router.use(checkAuth);
router.get("/", asyncHandler(postController.getPosts));
router.get("/get-my-posts", asyncHandler(postController.getMyPosts));
router.get("/get-user-posts", asyncHandler(postController.getUserPosts));
router.get("/post-by-slug", asyncHandler(postController.getPostBySlug));

router.get(
  "/get-post-comments/:postId",
  asyncHandler(postController.getPostComments)
);
router.post("/create", asyncHandler(postController.createPost));

router.post("/comment/:postId", asyncHandler(postController.commentOnPost));
router.post("/reply/:commentId", asyncHandler(postController.replyToComment));

router.put("/update-comment", asyncHandler(postController.updateComment));
router.put("/update-reply", asyncHandler(postController.updateReply));
router.put(
  "/upvote-comment/:commentId",
  asyncHandler(postController.upvoteComment)
);
router.put("/:postId", asyncHandler(postController.editPost));
router.put("/upvote/:postId", asyncHandler(postController.upvotePost));
router.put("/view/:postId", asyncHandler(postController.viewPost));

router.delete(
  "/delete-comment/:commentId",
  asyncHandler(postController.deleteComment)
);
router.delete(
  "/delete-reply/:commentId/:replyId",
  asyncHandler(postController.deleteCommentReply)
);
router.delete("/delete-post/:postId", asyncHandler(postController.deletePost));

export { router as postRouter };
