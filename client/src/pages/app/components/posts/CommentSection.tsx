import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useMutation } from "@tanstack/react-query";
import { postApi } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setStopFetchingPostComments } from "@/reducers/fullAppReducer";
import CommentItem from "./CommentItem";
import { useFullApp } from "@/store/hooks/useFullApp";
import { useGetPostComments } from "../../hooks/usePostsHandler";

type CommentSectionProps = {
  postId: number;
};
export const CommentSection = ({ postId }: CommentSectionProps) => {
  const dispatch = useDispatch();
  const { stopFetchingPostComments, currentPostComments: comments } =
    useFullApp();
  const [pageNumber, setPageNumber] = useState(1);
  const { isLoading: isCommentsLoading } = useGetPostComments(
    postId,
    8,
    pageNumber
  );
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      setPageNumber((prevPage) => prevPage + 1);
    }
  };
  const [newComment, setNewComment] = useState("");
  const { mutate: createComment, isPending: isCommentPending } = useMutation({
    mutationKey: [`create_comment_${postId}`],
    mutationFn: async (content: string) => {
      const { data } = await postApi.post(`/comment/${postId}`, {
        content: content.trim(),
      });
      return data;
    },
    onSuccess: () => {
      setNewComment("");
      dispatch(setStopFetchingPostComments(false));
    },
    onError: (err: any) => {
      toast({
        title: err.response?.data?.message || "Failed to create a comment.",
      });
    },
  });
  useEffect(() => {
    if (stopFetchingPostComments) {
      window.removeEventListener("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [stopFetchingPostComments]);

  return (
    <>
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Comments</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newComment.trim()) createComment(newComment.trim());
          }}
          className="space-y-4"
        >
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full"
          />
          <Button
            type="submit"
            disabled={!newComment.trim() || isCommentPending}
          >
            Post Comment
          </Button>
        </form>
        {comments?.map((comment) => (
          <CommentItem key={comment.id} comment={comment} postId={postId} />
        ))}
      </div>
      {isCommentsLoading && <h1>Loading...</h1>}
    </>
  );
};
