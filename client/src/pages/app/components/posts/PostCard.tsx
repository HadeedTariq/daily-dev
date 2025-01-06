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

export function PostCard({
  title,
  thumbnail,
  created_at,
  tags,
  upvotes,
  views,
  current_user_upvoted,
  squad_details,
  author_details,
}: PostCards) {
  const handleUpvote = () => {
    setIsUpvoted(!isUpvoted);
    setUpvoteCount(isUpvoted ? upvoteCount - 1 : upvoteCount + 1);
  };

  const handleReadPost = () => {
    console.log("Read Post clicked");
  };
  const [isUpvoted, setIsUpvoted] = useState(current_user_upvoted);
  const [upvoteCount, setUpvoteCount] = useState(upvotes);

  return (
    <Card className="max-w-md mx-auto">
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
              isUpvoted ? "text-primary" : ""
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
