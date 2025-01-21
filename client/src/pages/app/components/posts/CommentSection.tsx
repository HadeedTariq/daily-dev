import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CommentItem from "./CommentItem";
import { useMutation } from "@tanstack/react-query";
import { postApi } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

type CommentSectionProps = {
  postId: number;
  comments: Comments[];
  isCommentsLoading: boolean;
};
export default function CommentSection({
  comments,
  postId,
  isCommentsLoading,
}: CommentSectionProps) {
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

  if (isCommentsLoading) return <h1>Loading...</h1>;

  return (
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
        <Button type="submit" disabled={!newComment.trim() || isCommentPending}>
          Post Comment
        </Button>
      </form>
      {comments?.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} />
      ))}
    </div>
  );
}
