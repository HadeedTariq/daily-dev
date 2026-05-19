import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useGetCurrentPost } from "../hooks/usePostsHandler";
import { format } from "date-fns";
import MarkdownEditor from "@uiw/react-markdown-editor";

import UpvoteButton from "../components/posts/UpvoteButton";

import { useFullApp } from "@/store/hooks/useFullApp";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CommentSection } from "../components/posts/CommentSection";
import LoadingBar from "@/components/LoadingBar";
import {
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Eye,
  Calendar,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatSocialNumber } from "@/lib/utils";

const PostPage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { isLoading, isError, error } = useGetCurrentPost(
    params.post_slug as string,
  );

  const { currentPost: post } = useFullApp();

  if (isLoading) return <LoadingBar />;

  // Modern Error Boundary Rendering Block
  if (isError) {
    const errorMessage =
      (error as any)?.response?.data?.message ||
      "We encountered an unexpected error while retrieving post details.";

    return (
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 animate-in fade-in duration-300">
        <Alert
          variant="destructive"
          className="border-destructive/30 bg-destructive/[0.02] dark:bg-destructive/[0.02] rounded-2xl p-5 flex flex-col sm:flex-row items-start gap-4"
        >
          <div className="p-2 rounded-xl bg-destructive/10 text-destructive shrink-0 mx-auto sm:mx-0">
            <AlertCircle className="h-5 w-5" />
          </div>

          <div className="space-y-3 flex-1 text-center sm:text-left">
            <AlertTitle className="text-base font-bold tracking-tight text-destructive">
              Unable to Load Post
            </AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground leading-relaxed">
              {errorMessage}
            </AlertDescription>

            {/* Action Group for Error Resolution */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 justify-center sm:justify-start">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto h-9 px-4 rounded-xl border-border/80 text-muted-foreground hover:text-foreground gap-2 transition-all"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry Connection
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto h-9 px-4 rounded-xl text-muted-foreground hover:text-foreground gap-2 transition-all"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Go Back
              </Button>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  if (!params.post_slug) return <Navigate to={"/"} />;

  return (
    <>
      {post ? (
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-in fade-in duration-300">
          {/* Back Action Trigger */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="rounded-xl gap-2 text-muted-foreground hover:text-foreground transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to feed</span>
            </Button>
          </div>

          <header className="space-y-4">
            {/* Squad Context Badge Row */}
            <Link
              to={`/squads/${post.squad_details.squad_handle}`}
              className="inline-flex items-center gap-2 bg-secondary/60 dark:bg-zinc-800/40 px-3 py-1 rounded-xl border border-border/60 hover:border-indigo-500/30 transition-all group"
            >
              <Avatar className="h-5 w-5 rounded-md">
                <AvatarImage
                  src={post.squad_details.squad_thumbnail}
                  alt={post.squad_details.squad_handle}
                />
                <AvatarFallback className="text-[10px]">SQ</AvatarFallback>
              </Avatar>
              <span className="text-xs font-semibold text-foreground/80 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                @{post.squad_details.squad_handle}
              </span>
            </Link>

            {/* Typography Heading Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground/90 leading-tight">
              {post.title}
            </h1>

            {/* Author Attribution Meta Details Block */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-b border-border/40 pb-4">
              <Link
                to={`/user-profile/${post.author_details.author_username}`}
                className="flex items-center gap-3"
              >
                <Avatar className="h-10 w-10 border border-border/80 shadow-sm">
                  <AvatarImage
                    src={post.author_details.author_avatar}
                    alt={post.author_details.author_name}
                  />
                  <AvatarFallback className="bg-indigo-600 text-white font-medium text-sm">
                    {post.author_details.author_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-foreground/95 leading-none">
                    {post.author_details.author_name}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    @{post.author_details.author_username}
                  </p>
                </div>
              </Link>

              {/* Timestamp Metrics */}
              <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground/90">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                  <span>
                    {format(new Date(post.created_at), "dd MMM yyyy")}
                  </span>
                </div>
                <span className="text-muted-foreground/30 select-none">•</span>
                <div className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-muted-foreground/60" />
                  <span>{formatSocialNumber(post.views)} views</span>
                </div>
              </div>
            </div>
          </header>

          {/* Premium Fluid Aspect Aspect Media Card Wrapper */}
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-sm aspect-video max-h-[420px] w-full">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Custom Theme Responsive Markdown Content Section Area */}
          <div className="prose prose-stone dark:prose-invert max-w-none border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-inner markdown-render-wrapper">
            <MarkdownEditor.Markdown
              source={post.content}
              className="bg-transparent text-foreground/90 leading-relaxed text-sm sm:text-base"
            />
          </div>

          {/* Post Interaction Control Footer */}
          <footer className="space-y-5 pt-4">
            <Separator className="bg-border/60" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Dynamic Upvote Module Integration Layout */}
              <div className="flex items-center gap-3 bg-secondary/40 px-3 py-1.5 rounded-xl border border-border/60 w-max">
                <UpvoteButton
                  postId={post.id}
                  initialUpvotes={post.upvotes}
                  initialUserUpvoted={post.current_user_upvoted}
                />
                <span className="text-xs font-medium text-muted-foreground border-l border-border/80 pl-3 flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />{" "}
                  {formatSocialNumber(post.views)} views
                </span>
              </div>

              {/* System Taxonomy Categorization Tags Block */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 max-w-full">
                  <Tag className="h-3.5 w-3.5 text-muted-foreground/60 mr-1 shrink-0" />
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="bg-background/50 hover:bg-indigo-500/[0.03] text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 border-border/80 hover:border-indigo-500/20 rounded-lg px-2.5 py-0.5 text-xs font-medium transition-all"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator className="bg-border/60" />
          </footer>

          {/* Thread Comment Segment Compartment Row */}
          <div className="pt-2">
            <CommentSection postId={Number(post.id)} />
          </div>
        </article>
      ) : (
        <div className="min-h-[400px] w-full flex items-center justify-center">
          <LoadingBar />
        </div>
      )}
    </>
  );
};

export default PostPage;
