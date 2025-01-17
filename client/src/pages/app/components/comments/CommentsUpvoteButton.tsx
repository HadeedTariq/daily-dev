import { useState } from "react";
import { ChevronUp } from "lucide-react";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { postApi } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface CommentsUpvoteButtonProps {
  commentId: number;
  postId: number;
  initialUpvotes: number;
  initialUserUpvoted: boolean;
}

export default function CommentsUpvoteButton({
  commentId,
  initialUpvotes,
  initialUserUpvoted,
  postId,
}: CommentsUpvoteButtonProps) {
  const queryClient = useQueryClient();

  const [isUpvoted, setIsUpvoted] = useState(initialUserUpvoted);

  const { mutate: upvoteComment, isPending } = useMutation({
    mutationKey: [`upvote_${commentId}`],
    mutationFn: async () => {
      const { data } = await postApi.put(`/upvote-comment/${commentId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([
        `getPostComments_${postId}`,
      ] as InvalidateQueryFilters);
    },
    onError: (err: any) => {
      toast({
        title:
          err.response.data.message || "Something went wrong while upvoting",
      });
      setIsUpvoted(!isUpvoted);
      setUpvoteCount(isUpvoted ? upvoteCount - 1 : upvoteCount + 1);
    },
  });

  const [upvoteCount, setUpvoteCount] = useState(initialUpvotes);
  const handleUpvote = () => {
    if (isPending) return;
    setIsUpvoted(!isUpvoted);
    setUpvoteCount(isUpvoted ? upvoteCount - 1 : upvoteCount + 1);
    upvoteComment();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`flex items-center space-x-1 ${
        isUpvoted ? "text-green-500" : ""
      }`}
      onClick={handleUpvote}
    >
      <ChevronUp className={`h-4 w-4 ${isUpvoted ? "fill-current" : ""}`} />
      <span>{upvoteCount}</span>
    </Button>
  );
}
