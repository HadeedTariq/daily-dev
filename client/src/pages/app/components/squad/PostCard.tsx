import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, Eye, Calendar, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatSocialNumber } from "@/lib/utils";

export const PostCard = forwardRef<HTMLDivElement, SquadPost>(
  (
    {
      post_title,
      post_thumbnail,
      post_created_at,
      author_avatar,
      post_upvotes,
      post_views,
      post_tags,
      post_slug,
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className="group relative bg-card hover:bg-accent/10 rounded-2xl border border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-500/20 overflow-hidden"
      >
        <Link
          className="flex flex-col sm:flex-row h-full w-full"
          to={`/posts/${post_slug}`}
        >
          {/* Media Container with Adaptive Breakpoints */}
          <div className="relative w-full sm:w-44 md:w-52 h-48 sm:h-auto shrink-0 overflow-hidden bg-muted">
            <img
              src={post_thumbnail}
              alt={post_title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
            {/* Soft Ambient Overlay for Light Theme Contexts */}
            <div className="absolute inset-0 bg-black/[0.02] dark:bg-transparent pointer-events-none" />
          </div>

          {/* Metadata & Typography Content Block */}
          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between min-w-0 space-y-4">
            <div className="space-y-2">
              {/* Header Context Action Meta Row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                  <span>
                    {new Date(post_created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Micro Action Visual Anchor */}
                <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo-500" />
              </div>

              {/* Responsive Core Title Headline */}
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground/90 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                {post_title}
              </h3>
            </div>

            {/* Layout Footer Container Contextual Rows */}
            <div className="space-y-4 pt-1">
              {/* Categorization Taxonomy Badges Block */}
              {post_tags && post_tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 max-w-full">
                  {post_tags.slice(0, 3).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-secondary/40 border-border/60 text-muted-foreground hover:text-foreground text-[11px] font-medium px-2 py-0 rounded-lg select-none transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {post_tags.length > 3 && (
                    <span className="text-[10px] font-semibold text-muted-foreground/60 px-1 self-center">
                      +{post_tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Attribution Author Frame and Analytics Indicators Segment */}
              <div className="flex items-center justify-between gap-4 border-t border-border/40 pt-3">
                <Avatar className="h-6 w-6 border border-border/60 ring-2 ring-background shadow-inner">
                  <AvatarImage src={author_avatar} alt="Post Author" />
                  <AvatarFallback className="text-[9px] font-bold bg-muted">
                    U
                  </AvatarFallback>
                </Avatar>

                <div className="flex items-center gap-3.5 text-xs font-semibold text-muted-foreground/80">
                  <div className="flex items-center gap-1.5 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    <ThumbsUp className="h-3.5 w-3.5 stroke-[2]" />
                    <span>{formatSocialNumber(post_upvotes)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 stroke-[2]" />
                    <span>{formatSocialNumber(post_views)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  },
);

PostCard.displayName = "PostCard";
