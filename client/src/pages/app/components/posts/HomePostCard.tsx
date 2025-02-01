import { format } from "date-fns";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Link } from "react-router-dom";
import UpvoteButton from "./UpvoteButton";
import { forwardRef } from "react";

export const HomePostCard = forwardRef<HTMLDivElement, PostCards>(
  (
    {
      title,
      thumbnail,
      created_at,
      tags,
      upvotes,
      views,
      current_user_upvoted,
      squad_details,
      author_details,
      slug,
      id,
    },
    ref
  ) => {
    return (
      <Card className="w-[400px] h-[500px]" ref={ref}>
        <CardHeader className="relative p-0">
          <img
            src={thumbnail}
            alt={title}
            width={400}
            height={200}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <Link to={`/posts/${slug}`}>
            <Button variant="secondary" className="absolute top-2 right-2">
              Read Post
            </Button>
          </Link>
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
            {tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <UpvoteButton
              postId={id}
              initialUpvotes={upvotes}
              initialUserUpvoted={current_user_upvoted}
            />
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
);
