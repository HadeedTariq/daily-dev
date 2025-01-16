import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { postApi } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import { useFullApp } from "@/store/hooks/useFullApp";

interface CommentItemProps {
  comment: Comment | CommentReplies;
  isReply?: boolean;
  commentId?: number;
  isReplyPending?: boolean;
}

function UserInfo({
  user,
  createdAt,
  edited,
  updatedAt,
  setIsReplying,
  isReply,
  id,
  parentId,
  setIsCommentEditing,
  setIsReplyEditing,
}: {
  user: any;
  createdAt: string;
  id: number;
  updatedAt: string;
  edited: boolean;
  isReply: boolean;
  setIsReplying: any;
  setIsCommentEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsReplyEditing: React.Dispatch<React.SetStateAction<boolean>>;
  parentId?: number;
}) {
  const queryClient = useQueryClient();

  const { user: currentUser } = useFullApp();

  const { mutate: deleteComment, isPending } = useMutation({
    mutationKey: [`delete_comment`],
    mutationFn: async ({ commentId }: { commentId: number }) => {
      const { data } = await postApi.delete(`/delete-comment/${commentId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([
        "getPostComments",
      ] as InvalidateQueryFilters);
    },
    onError: (err: any) => {
      toast({
        title: err.response.data.message || "Failed to delete a comment.",
      });
    },
  });
  const { mutate: deleteReply, isPending: isReplyDeleting } = useMutation({
    mutationKey: [`delete_reply`],
    mutationFn: async ({
      commentId,
      replyId,
    }: {
      commentId: number;
      replyId: number;
    }) => {
      const { data } = await postApi.delete(
        `/delete-reply/${commentId}/${replyId}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([
        "getPostComments",
      ] as InvalidateQueryFilters);
    },
    onError: (err: any) => {
      toast({
        title: err.response.data.message || "Failed to delete a reply.",
      });
    },
  });
  return (
    <div className="flex items-center space-x-2">
      <Avatar>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <span className="font-semibold">{user.name}</span>
        <span className="text-sm text-gray-500 ml-2">@{user.username}</span>
      </div>
      {!edited ? (
        <span className="text-sm text-gray-500">
          {new Date(createdAt).toLocaleDateString()}
        </span>
      ) : (
        <span className="text-sm text-gray-500">
          {new Date(updatedAt).toLocaleDateString()}
        </span>
      )}
      {edited && <span className="text-sm text-gray-500">(edited)</span>}

      {isReply && currentUser?.id === user.id && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MenuIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => setIsReplyEditing((last) => !last)}
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled={isReplyDeleting}
              onClick={() => {
                deleteReply({ commentId: Number(parentId), replyId: id });
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {!isReply && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MenuIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setIsReplying((last: boolean) => !last);
              }}
            >
              Reply
            </DropdownMenuItem>

            {currentUser?.id === user.id && (
              <DropdownMenuItem
                onClick={() => setIsCommentEditing((last) => !last)}
              >
                Edit
              </DropdownMenuItem>
            )}
            {currentUser?.id === user.id && (
              <DropdownMenuItem
                disabled={isPending}
                onClick={() => {
                  deleteComment({ commentId: id });
                }}
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export default function CommentItem({
  comment,
  isReply,
  commentId,
}: CommentItemProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const queryClient = useQueryClient();
  const [isReplying, setIsReplying] = useState(false);
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [isReplyEditing, setIsReplyEditing] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [editContent, setEditContent] = useState(comment.content);
  const { mutate: createReply, isPending: isReplyPending } = useMutation({
    mutationKey: [`create_reply`],
    mutationFn: async ({
      commentId,
      content,
      receiverId,
    }: {
      content: string;
      commentId: number;
      receiverId: number;
    }) => {
      const { data } = await postApi.post(`/reply/${commentId}`, {
        content,
        receiverId,
      });
      return data;
    },
    onSuccess: () => {
      setReplyContent("");
      setIsReplying(false);
      queryClient.invalidateQueries([
        "getPostComments",
      ] as InvalidateQueryFilters);
    },
    onError: (err: any) => {
      toast({
        title: err.response.data.message || "Failed to create a reply.",
      });
    },
  });

  const { mutate: updateComment, isPending: isCommentUpdationPending } =
    useMutation({
      mutationKey: [`update_comment`],
      mutationFn: async ({
        commentId,
        content,
      }: {
        content: string;
        commentId: number;
      }) => {
        const { data } = await postApi.put(`/update-comment`, {
          content,
          commentId,
        });
        return data;
      },
      onSuccess: () => {
        setIsCommentEditing(false);
        queryClient.invalidateQueries([
          "getPostComments",
        ] as InvalidateQueryFilters);
      },
      onError: (err: any) => {
        console.log(err);

        toast({
          title: err.response.data.message || "Failed to update a comment.",
        });
      },
    });

  const { mutate: updateReply, isPending: isReplyUpdationPending } =
    useMutation({
      mutationKey: [`update_reply`],
      mutationFn: async ({
        replyId,
        content,
      }: {
        content: string;
        replyId: number;
      }) => {
        const { data } = await postApi.put(`/update-reply`, {
          content,
          replyId,
        });
        return data;
      },
      onSuccess: () => {
        setIsReplyEditing(false);
        queryClient.invalidateQueries([
          "getPostComments",
        ] as InvalidateQueryFilters);
      },
      onError: (err: any) => {
        toast({
          title: err.response.data.message || "Failed to update a reply.",
        });
      },
    });

  const userDetails = isReply
    ? (comment as CommentReplies).sender_details
    : (comment as Comment).user_details;

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsReplying(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={`space-y-4 ${isReply ? "ml-8" : ""}`}>
      <div className="flex flex-col space-y-2">
        <UserInfo
          id={comment.id}
          isReply={isReply as boolean}
          setIsReplying={setIsReplying}
          setIsCommentEditing={setIsCommentEditing}
          setIsReplyEditing={setIsReplyEditing}
          user={userDetails}
          createdAt={comment.created_at}
          updatedAt={comment.updated_at}
          edited={comment.edited}
          parentId={isReply ? commentId : undefined}
        />
        {isReply ? (
          <>
            {isReplyEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Update Reply"
                  className="w-full"
                />
                <Button
                  onClick={() =>
                    updateReply({
                      replyId: comment.id,
                      content: editContent.trim(),
                    })
                  }
                  disabled={isReplyUpdationPending}
                >
                  Update Reply
                </Button>
              </div>
            ) : (
              <p className="mt-2">
                <span className="font-semibold text-blue-500">
                  @{(comment as CommentReplies).recipient_details.username}{" "}
                </span>
                {comment.content}
              </p>
            )}
          </>
        ) : (
          <>
            {isCommentEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Update Comment"
                  className="w-full"
                />
                <Button
                  onClick={() =>
                    updateComment({
                      commentId: comment.id,
                      content: editContent.trim(),
                    })
                  }
                  disabled={isCommentUpdationPending}
                >
                  Update Comment
                </Button>
              </div>
            ) : (
              <p className="mt-2">{comment.content}</p>
            )}
          </>
        )}
      </div>
      {isReplying && (
        <div className="space-y-2" ref={ref}>
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full"
          />
          <Button
            onClick={() =>
              createReply({
                commentId: comment.id,
                content: replyContent.trim(),
                receiverId: userDetails.id,
              })
            }
            disabled={!replyContent.trim() || isReplyPending}
          >
            Post Reply
          </Button>
        </div>
      )}
      {!isReply &&
        (comment as Comment).replies &&
        (comment as Comment).replies.map((reply) => (
          <CommentItem
            key={reply.id}
            commentId={comment.id}
            comment={reply}
            isReply={true}
          />
        ))}
    </div>
  );
}
