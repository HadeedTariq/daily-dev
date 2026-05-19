import { formatSocialNumber } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  Eye,
  MessageSquare,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";

export function SquadStats({ squad }: { squad: SquadDetails }) {
  const totalPosts = squad.squad_posts_metadata?.length || 0;

  const totalUpvotes = squad.squad_posts_metadata?.reduce(
    (sum, post) => sum + post.post_upvotes,
    0,
  );

  const totalViews = squad.squad_posts_metadata?.reduce(
    (sum, post) => sum + post.post_views,
    0,
  );

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/80 backdrop-blur-xl shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-violet-500/[0.03]" />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
              Squad Stats
            </h2>

            <p className="text-sm text-muted-foreground">
              Community activity and engagement overview
            </p>
          </div>

          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
            <BarChart3 className="h-5 w-5" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="group rounded-2xl border border-border/60 bg-card/60 p-4 transition-all duration-300 hover:border-indigo-500/30 hover:bg-card">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                  <MessageSquare className="h-5 w-5" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Posts
                  </p>

                  <h3 className="text-2xl font-bold tracking-tight text-foreground">
                    {formatSocialNumber(totalPosts)}
                  </h3>
                </div>
              </div>

              <div className="rounded-full border border-border/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                Posts
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-border/60 bg-card/60 p-4 transition-all duration-300 hover:border-violet-500/30 hover:bg-card">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500 dark:text-violet-400">
                  <ThumbsUp className="h-5 w-5" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Upvotes
                  </p>

                  <h3 className="text-2xl font-bold tracking-tight text-foreground">
                    {formatSocialNumber(totalUpvotes) || 0}
                  </h3>
                </div>
              </div>

              <div className="rounded-full border border-border/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                Likes
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-border/60 bg-card/60 p-4 transition-all duration-300 hover:border-blue-500/30 hover:bg-card">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 dark:text-blue-400">
                  <Eye className="h-5 w-5" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Views
                  </p>

                  <h3 className="text-2xl font-bold tracking-tight text-foreground">
                    {formatSocialNumber(totalViews) || 0}
                  </h3>
                </div>
              </div>

              <div className="rounded-full border border-border/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                Reach
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-border/60 bg-card/60 p-4 transition-all duration-300 hover:border-emerald-500/30 hover:bg-card">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                  <Calendar className="h-5 w-5" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Created At
                  </p>

                  <h3 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                    {new Date(squad.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </h3>
                </div>
              </div>

              <div className="rounded-full border border-border/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                Active
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              Squad engagement is growing steadily
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-indigo-500 dark:text-indigo-400">
              {" "}
              Community Insights
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
