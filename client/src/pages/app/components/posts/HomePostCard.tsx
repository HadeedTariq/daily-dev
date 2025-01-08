import { useState } from "react";
import { format } from "date-fns";
import { ChevronUp, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { postApi } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

export function HomePostCard({
  title,
  thumbnail,
  created_at,
  tags,
  upvotes,
  views,
  current_user_upvoted,
  squad_details,
  author_details,
  id,
}: PostCards) {
  const handleReadPost = () => {
    console.log("Read Post clicked");
  };
  const [isUpvoted, setIsUpvoted] = useState(current_user_upvoted);

  const { mutate: upvotePost, isPending } = useMutation({
    mutationKey: [`upvote_${id}`],
    mutationFn: async () => {
      const { data } = await postApi.put(`/upvote/${id}`);
      return data;
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

  const [upvoteCount, setUpvoteCount] = useState(upvotes);
  const handleUpvote = () => {
    if (isPending) return;
    setIsUpvoted(!isUpvoted);
    setUpvoteCount(isUpvoted ? upvoteCount - 1 : upvoteCount + 1);
    upvotePost();
  };
  return (
    <Card className="w-[400px]">
      <CardHeader className="relative p-0">
        <img
          src={thumbnail}
          alt={title}
          width={400}
          height={200}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Button
          variant="secondary"
          className="absolute top-2 right-2"
          onClick={handleReadPost}
        >
          Read Post
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center space-x-2 mb-2">
          <img
            src={squad_details.squad_thumbnail}
            alt={squad_details.squad_handle}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm text-muted-foreground">
            @{squad_details.squad_handle}
          </span>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">
            {format(new Date(created_at), "MMM d, yyyy")}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center space-x-1 ${
              isUpvoted ? "text-green-500" : ""
            }`}
            onClick={handleUpvote}
          >
            <ChevronUp
              className={`h-4 w-4 ${isUpvoted ? "fill-current" : ""}`}
            />
            <span>{upvoteCount}</span>
          </Button>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span className="text-sm">{views}</span>
          </div>
        </div>
        <img
          src={author_details.author_avatar}
          alt="Author"
          width={32}
          height={32}
          className="rounded-full"
        />
      </CardFooter>
    </Card>
  );
}
