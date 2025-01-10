import { useState } from "react";
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
  isReplyPending?: boolean;
}

function UserInfo({
  user,
  createdAt,
  edited,
  updatedAt,
  setIsReplying,
  isReply,
}: {
  user: any;
  createdAt: string;
  updatedAt: string;
  edited: boolean;
  isReply: boolean;
  setIsReplying: any;
}) {
  const { user: currentUser } = useFullApp();
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
            <DropdownMenuItem>Edit</DropdownMenuItem>

            <DropdownMenuItem>Delete</DropdownMenuItem>
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
              onClick={() => setIsReplying((last: boolean) => !last)}
            >
              Reply
            </DropdownMenuItem>

            {currentUser?.id === user.id && (
              <DropdownMenuItem>Edit</DropdownMenuItem>
            )}
            {currentUser?.id === user.id && (
              <DropdownMenuItem>Delete</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export default function CommentItem({ comment, isReply }: CommentItemProps) {
  const queryClient = useQueryClient();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
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

  const userDetails = isReply
    ? (comment as CommentReplies).sender_details
    : (comment as Comment).user_details;

  return (
    <div className={`space-y-4 ${isReply ? "ml-8" : ""}`}>
      <div className="flex flex-col space-y-2">
        <UserInfo
          isReply={isReply as boolean}
          setIsReplying={setIsReplying}
          user={userDetails}
          createdAt={comment.created_at}
          updatedAt={comment.updated_at}
          edited={comment.edited}
        />
        <p className="mt-2">
          {isReply && (
            <span className="font-semibold text-blue-500">
              @{(comment as CommentReplies).recipient_details.username}{" "}
            </span>
          )}
          {comment.content}
        </p>
      </div>
      {isReplying && (
        <div className="space-y-2">
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
          <CommentItem key={reply.id} comment={reply} isReply={true} />
        ))}
    </div>
  );
}
