import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useMutation } from "@tanstack/react-query";
import { postApi } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

import CommentItem from "./CommentItem";

import { useGetPostComments } from "../../hooks/usePostsHandler";
import { useInView } from "react-intersection-observer";

type CommentSectionProps = {
  postId: number;
};
export const CommentSection = ({ postId }: CommentSectionProps) => {
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isFetched,
    isPending,
    comments,
  } = useGetPostComments(postId, 8);
  const { ref, inView } = useInView({
    threshold: 1,
  });
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
    },
    onError: (err: any) => {
      toast({
        title: err.response?.data?.message || "Failed to create a comment.",
      });
    },
  });
  useEffect(() => {
    if (
      inView &&
      hasNextPage &&
      isFetched &&
      !isFetching &&
      !isPending &&
      !isLoading &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
        {comments?.map((comment, index) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            ref={index === comments.length - 1 ? ref : undefined}
          />
        ))}
      </div>
      {isLoading && <h1>Loading...</h1>}
    </>
  );
};
