import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useMutation } from "@tanstack/react-query";
import { postApi } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

import CommentItem from "./CommentItem";

import { useGetPostComments } from "../../hooks/usePostsHandler";
import { useInView } from "react-intersection-observer";
import { MessageSquare, SendHorizontal, Loader2 } from "lucide-react";

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
    <div className="space-y-6 max-w-3xl mx-auto w-full animate-in fade-in duration-300">
      {/* Dynamic Header Badge Row */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <MessageSquare className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Discussion
          </h2>
          {comments && comments.length > 0 && (
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
              {comments.length}
            </span>
          )}
        </div>
      </div>

      {/* Modern Card Form Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newComment.trim()) createComment(newComment.trim());
        }}
        className="group relative rounded-xl border border-border/80 bg-card/50 p-4 transition-all focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20"
      >
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts or ask a question..."
          rows={3}
          className="w-full resize-none border-0 bg-transparent p-0 shadow-none outline-none focus-visible:ring-0 text-sm sm:text-base text-foreground/90 placeholder:text-muted-foreground/60 min-h-[80px]"
        />

        <div className="flex items-center justify-end border-t border-border/40 pt-3 mt-2">
          <Button
            type="submit"
            disabled={!newComment.trim() || isCommentPending}
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium rounded-xl h-9 px-4 text-xs gap-2 transition-all shadow-sm shadow-indigo-500/10 select-none"
          >
            {isCommentPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <SendHorizontal className="h-3.5 w-3.5" />
                <span>Comment</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Thread Container / Infinite Scroll Stack */}
      <div className="relative space-y-1">
        {comments && comments.length > 0 ? (
          <div className="divide-y divide-border/40">
            {comments.map((comment, index) => (
              <div
                key={comment.id}
                className="py-4 animate-in slide-in-from-bottom-2 duration-300 ease-out fill-mode-both"
                style={{ animationDelay: `${Math.min(index * 40, 300)}ms` }}
              >
                <CommentItem
                  comment={comment}
                  postId={postId}
                  ref={index === comments.length - 1 ? ref : undefined}
                />
              </div>
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl border border-dashed border-border text-center animate-in fade-in duration-300">
              <MessageSquare className="h-8 w-8 text-muted-foreground/40 stroke-[1.5] mb-3" />
              <p className="text-sm font-medium text-muted-foreground/80">
                No comments yet
              </p>
              <p className="text-xs text-muted-foreground/50 mt-1">
                Be the first to start the conversation!
              </p>
            </div>
          )
        )}

        {/* Fluid Skeleton Loading Animations */}
        {(isLoading || isFetchingNextPage) && (
          <div className="divide-y divide-border/40 pointer-events-none">
            {[...Array(isLoading ? 3 : 1)].map((_, i) => (
              <div
                key={i}
                className="py-5 flex items-start gap-3 animate-pulse"
              >
                <div className="h-9 w-9 rounded-full bg-muted shrink-0" />
                <div className="space-y-2.5 flex-1 pt-1">
                  <div className="flex items-center gap-2">
                    <div className="h-3.5 w-24 bg-muted rounded-md" />
                    <div className="h-3 w-12 bg-muted/60 rounded-md" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-full bg-muted/80 rounded-md" />
                    <div className="h-3.5 w-2/3 bg-muted/60 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
