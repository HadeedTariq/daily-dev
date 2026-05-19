import { format } from "date-fns";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { UserPost } from "../../routes/MyPosts";
import { Edit, MoreHorizontal, Trash, BookOpen, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { postApi } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

export const ProfilePostCard = ({
  title,
  thumbnail,
  created_at,
  squad_details,
  slug,
  id,
  loginUser = true,
}: UserPost & {
  loginUser?: boolean;
}) => {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deletePost, isPending } = useMutation({
    mutationKey: [`delete_post_${id}`],
    mutationFn: async () => {
      const { data } = await postApi.delete(`/delete-post/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["getMyPosts"] as InvalidateQueryFilters);
    },
    onError: (err: any) => {
      toast({
        title: err.response.data.message || "Failed to delete a comment.",
      });
    },
  });

  return (
    <Card
      className="group overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-2px] hover:border-indigo-500/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col h-full w-full max-w-md mx-auto"
      key={id}
    >
      {/* Header Image Section with Action Overlays */}
      <div className="relative w-full aspect-video overflow-hidden bg-muted">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Dark Gradient Overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Dropdown Action Menu Button */}
        {loginUser && (
          <div className="absolute top-3 right-3 z-10">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-xl bg-background/80 dark:bg-zinc-900/80 backdrop-blur-md border border-border/40 text-foreground hover:bg-background shadow-sm transition-all"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="rounded-xl min-w-[140px] border-border/80"
              >
                <Link to={`/post/edit/${id}`}>
                  <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg text-sm text-muted-foreground hover:text-foreground">
                    <Edit className="h-4 w-4 stroke-[1.5]" />
                    <span>Edit post</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  onClick={() => deletePost()}
                  disabled={isPending}
                  className="cursor-pointer gap-2 rounded-lg text-sm text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4 stroke-[1.5]" />
                  )}
                  <span>Delete post</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Card Body Content */}
      <CardContent className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2.5">
          {/* Squad & Date Micro-Metadata row */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-secondary/50 dark:bg-zinc-800/40 px-2 py-0.5 rounded-lg border border-border/40">
              <img
                src={squad_details.squad_thumbnail}
                alt={squad_details.squad_handle}
                className="w-4 h-4 rounded-md object-cover"
              />
              <span className="text-xs font-medium text-foreground/80 truncate max-w-[120px]">
                @{squad_details.squad_handle}
              </span>
            </div>
            <span className="text-xs text-muted-foreground/40 select-none">
              •
            </span>
            <span className="text-xs font-medium text-muted-foreground/80">
              {format(new Date(created_at), "MMM d, yyyy")}
            </span>
          </div>

          {/* Heading Title */}
          <h3 className="text-base font-bold tracking-tight text-foreground/90 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
            {title}
          </h3>
        </div>

        {/* Read Post Action Footer Button */}
        <Link to={`/posts/${slug}`} className="block w-full">
          <Button
            variant="outline"
            className="w-full justify-center gap-2 h-9 text-xs font-semibold rounded-xl border-border/80 text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/[0.03] transition-all group/btn"
          >
            <BookOpen className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:scale-105" />
            Read Post
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
