import { format } from "date-fns";
import { Eye, ArrowUpRight, Hash, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    ref,
  ) => {
    return (
      <TooltipProvider delayDuration={200}>
        <Card
          ref={ref}
          className="
            group relative flex flex-col
            w-[400px] max-[770px]:w-full max-[770px]:mx-auto
            h-[500px]
            bg-card border border-border
            rounded-xl overflow-hidden
            shadow-sm hover:shadow-md
            transition-shadow duration-200
          "
        >
          {/* ── Thumbnail ─────────────────────────────────────────── */}
          <CardHeader className="relative p-0 shrink-0">
            <div className="relative w-full h-48 overflow-hidden bg-muted">
              <img
                src={thumbnail}
                alt={title}
                className="
                  w-full h-full object-cover
                  transition-transform duration-300
                  group-hover:scale-[1.03]
                "
              />
              {/* Subtle gradient so text overlays are readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Read Post CTA — anchored bottom-right of image */}
            <Link
              to={`/posts/${slug}`}
              className="absolute bottom-3 right-3"
              tabIndex={-1}
            >
              <Button
                size="sm"
                className="
                  h-8 gap-1.5 px-3 text-xs font-semibold tracking-wide
                  bg-background/90 backdrop-blur-sm text-foreground
                  border border-border/60
                  hover:bg-primary hover:text-primary-foreground hover:border-primary
                  transition-colors duration-150
                "
              >
                Read Post
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
              </Button>
            </Link>
          </CardHeader>

          {/* ── Body ──────────────────────────────────────────────── */}
          <CardContent className="flex flex-col flex-1 pt-4 pb-0 px-4 min-h-0">
            {/* Squad + Date row */}
            <div className="flex items-center gap-2 mb-3">
              {/* Squad pill */}
              <Link
                to={`/squads/${squad_details.squad_handle}`}
                className="
                  flex items-center gap-1.5 shrink-0
                  px-2 py-0.5 rounded-full
                  bg-muted hover:bg-accent
                  border border-border/50
                  transition-colors duration-150
                "
              >
                <div className="relative h-4 w-4 shrink-0 rounded-full overflow-hidden ring-1 ring-border/40">
                  <img
                    src={squad_details.squad_thumbnail}
                    alt={squad_details.squad_handle}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground leading-none">
                  @{squad_details.squad_handle}
                </span>
              </Link>

              {/* Divider dot */}
              <span className="text-border select-none">·</span>

              {/* Date */}
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3 w-3 shrink-0" />
                <span className="text-[11px] font-medium tabular-nums">
                  {format(new Date(created_at), "MMM d, yyyy")}
                </span>
              </div>
            </div>

            {/* Title */}
            <Link to={`/posts/${slug}`} className="group/title block mb-3">
              <h3
                className="
                  text-[15px] font-semibold leading-snug
                  text-foreground
                  line-clamp-2
                  group-hover/title:text-primary
                  transition-colors duration-150
                "
              >
                {title}
              </h3>
            </Link>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.slice(0, 4).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="
                      h-5 px-2 gap-1
                      text-[10px] font-medium tracking-wide uppercase
                      bg-muted hover:bg-accent
                      text-muted-foreground hover:text-foreground
                      border border-border/40
                      cursor-pointer transition-colors duration-150
                      rounded-md
                    "
                  >
                    <Hash className="h-2.5 w-2.5" />
                    {tag}
                  </Badge>
                ))}
                {tags.length > 4 && (
                  <Badge
                    variant="outline"
                    className="h-5 px-2 text-[10px] font-medium text-muted-foreground rounded-md"
                  >
                    +{tags.length - 4}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>

          {/* ── Footer ────────────────────────────────────────────── */}
          <CardFooter className="mt-auto px-4 py-3 flex items-center justify-between gap-3">
            <Separator className="absolute left-0 right-0 top-0" />

            {/* Left — engagement stats */}
            <div className="flex items-center gap-3">
              <UpvoteButton
                postId={id}
                initialUpvotes={upvotes}
                initialUserUpvoted={current_user_upvoted}
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Eye className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-xs font-medium tabular-nums">
                      {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {views.toLocaleString()} views
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Right — author */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={`/user-profile/${author_details.author_username}`}
                  className="flex items-center gap-2 group/author"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] font-semibold text-foreground leading-none group-hover/author:text-primary transition-colors duration-150">
                      {author_details.author_name}
                    </span>
                    <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
                      @{author_details.author_username}
                    </span>
                  </div>
                  <div className="relative h-8 w-8 shrink-0 rounded-full overflow-hidden ring-2 ring-border group-hover/author:ring-primary transition-all duration-150">
                    <img
                      src={author_details.author_avatar}
                      alt={author_details.author_name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                View profile
              </TooltipContent>
            </Tooltip>
          </CardFooter>
        </Card>
      </TooltipProvider>
    );
  },
);

HomePostCard.displayName = "HomePostCard";
