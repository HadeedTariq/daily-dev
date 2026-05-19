import { CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Building2,
  Calendar,
  Users,
  Eye,
  Award,
  ThumbsUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { followerApi, profileApi } from "@/lib/axios";
import { SocialLinks } from "../../components/SocialLinks";

import { Navigate, Outlet, useParams } from "react-router-dom";

import ShareProfile from "../../components/ShareProfile";

import SquadGrid from "../../components/SquadGrid";
import { useGetUserJoinedSquads } from "../../hooks/useGetJoinedSquads";
import { useState } from "react";
import { useFullApp } from "@/store/hooks/useFullApp";
import { useDispatch } from "react-redux";
import { setCurrentUserProfile } from "@/reducers/fullAppReducer";
import { UserProfileHeader } from "../../components/user-profile/UserProfileHeader";
import { UserFollowersDialog } from "../../components/user-profile/UserFollowersDialog";
import { UserFollowingsDialog } from "../../components/user-profile/UserFollowingsDialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@radix-ui/react-separator";

export default function UserProfile() {
  const queryClient = useQueryClient();

  const [isFollowersDialogOpen, setIsFollowersDialogOpen] = useState(false);
  const { username } = useParams();
  const { user } = useFullApp();

  const handleFollowersClick = () => {
    setIsFollowersDialogOpen(true);
  };
  const dispatch = useDispatch();

  const [isFollowingsDialogOpen, setIsFollowingsDialogOpen] = useState(false);

  const handleFollowingsClick = () => {
    setIsFollowingsDialogOpen(true);
  };

  const {
    isLoading,
    data: profile,
    isError,
    error,
    failureCount,
  } = useQuery({
    queryKey: [`getProfile_${username}`],
    queryFn: async () => {
      const { data } = await profileApi.get(`/user/${username}`);
      dispatch(setCurrentUserProfile(data.profile));
      return data.profile as UserProfile & { current_user_follow: boolean };
    },
  });

  const { data: joinedSquads, isLoading: isSquadLoading } =
    useGetUserJoinedSquads(profile?.id);

  const { mutate: unFollowUser, isPending } = useMutation({
    mutationKey: ["unfollowUser"],
    mutationFn: async (followedId: number) => {
      const { data } = await followerApi.put(`/unfollow`, { followedId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([
        `getProfile_${username}`,
      ] as InvalidateQueryFilters);
    },
    onError: (err: any) => {
      toast({
        title: err.response.data.message || "Failed to unfollow a user",
        variant: "destructive",
      });
    },
  });
  const { mutate: followUser, isPending: isFollowingPending } = useMutation({
    mutationKey: ["followUser"],
    mutationFn: async (followedId: number) => {
      const { data } = await followerApi.put(`/follow`, { followedId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([
        `getProfile_${username}`,
      ] as InvalidateQueryFilters);
    },
    onError: (err: any) => {
      toast({
        title: err.response.data.message || "Failed to follow a user",
        variant: "destructive",
      });
    },
  });

  if (error || isError || failureCount > 1) return <Navigate to={"/"} />;
  if (isLoading) return <div>Loading...</div>;
  if (!profile) return <div>Loading...</div>;
  if (!username) return <Navigate to={"/"} />;

  if (profile?.username === user?.username) return <Navigate to={"/"} />;

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-background text-foreground selection:bg-indigo-500/30">
      {/* LEFT AREA: Sticky Global Header & Feed/Outlet Content */}
      <div className="flex-1 flex flex-col min-w-0 order-2 lg:order-1">
        {/* Global/Feed Nav Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <UserProfileHeader />
          </div>
        </header>

        {/* Core Main Viewport Container */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <Outlet
            context={{
              userId: profile.id,
            }}
          />
        </main>
      </div>

      {/* RIGHT SIDEBAR: Responsive Profile Presentation Sidebar Layout (Replaced raw absolute layout) */}
      <aside className="w-full lg:w-[380px] xl:w-[420px] lg:border-l bg-card/30 lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto order-1 lg:order-2 border-b lg:border-b-0 hide-scrollbar">
        <div className="p-4 sm:p-6 space-y-6">
          {/* Header Action Row */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold tracking-tight text-muted-foreground/80 uppercase">
                User Profile
              </h2>
              <ShareProfile />
            </div>

            {/* Dynamic Context Action Control Trigger */}
            {profile.current_user_follow ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => unFollowUser(profile.id)}
                disabled={isPending}
                className="rounded-xl h-8 px-3 font-medium text-xs shadow-sm shadow-destructive/10 transition-all"
              >
                Unfollow
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => followUser(profile.id)}
                disabled={isFollowingPending}
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl h-8 px-3 font-medium text-xs shadow-sm shadow-indigo-500/10 transition-all"
              >
                Follow
              </Button>
            )}
          </div>

          {/* Profile Identity Info Card */}
          <div className="flex flex-col items-center text-center sm:text-left sm:flex-row sm:items-start gap-4">
            <Avatar className="h-20 w-20 ring-4 ring-indigo-500/10 border-2 border-background shadow-xl shrink-0">
              <AvatarImage
                src={profile.avatar}
                alt={profile.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-indigo-600 text-white font-medium text-xl">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
                <CardTitle className="text-2xl font-bold tracking-tight text-foreground truncate">
                  {profile.name}
                </CardTitle>
                {profile.profession && (
                  <Badge
                    variant="secondary"
                    className="w-max mx-auto sm:mx-0 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-none hover:bg-indigo-500/20 font-medium text-xs"
                  >
                    {profile.profession}
                  </Badge>
                )}
              </div>
              <p className="text-sm font-medium text-muted-foreground truncate">
                @{profile.username}
              </p>
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Detailed Metadata / About Container */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground/90">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {profile.about.bio || "No bio provided"}
            </p>

            <div className="space-y-2 pt-2 text-sm text-muted-foreground">
              {profile.about.company && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                  <span>{profile.about.company}</span>
                </div>
              )}
              {profile.about.job_title && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                  <span>{profile.about.job_title}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground/80 pt-1">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>
                  Member since:{" "}
                  {new Date(profile.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Analytical Interactive Performance Metrics Stats Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground/90">
              Platform Performance
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Followers Component Anchor */}
              <button
                onClick={() => handleFollowersClick()}
                className="flex items-center gap-3 p-2.5 rounded-xl border bg-card/50 hover:bg-accent/50 hover:text-accent-foreground text-left transition-all group duration-200 w-full"
              >
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
                  <Users className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Followers</div>
                  <div className="text-sm font-bold tracking-tight truncate">
                    {profile.user_stats.followers}
                  </div>
                </div>
              </button>

              <UserFollowersDialog
                userId={profile.id}
                isOpen={isFollowersDialogOpen}
                onClose={() => setIsFollowersDialogOpen(false)}
              />

              {/* Following Component Anchor */}
              <button
                onClick={() => handleFollowingsClick()}
                className="flex items-center gap-3 p-2.5 rounded-xl border bg-card/50 hover:bg-accent/50 hover:text-accent-foreground text-left transition-all group duration-200 w-full"
              >
                <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:scale-105 transition-transform shrink-0">
                  <Users className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Following</div>
                  <div className="text-sm font-bold tracking-tight truncate">
                    {profile.user_stats.following}
                  </div>
                </div>
              </button>

              <UserFollowingsDialog
                userId={profile.id}
                isOpen={isFollowingsDialogOpen}
                onClose={() => setIsFollowingsDialogOpen(false)}
              />

              {/* Reputation Info Item */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl border bg-card/50">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                  <Award className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">
                    Reputation
                  </div>
                  <div className="text-sm font-bold tracking-tight truncate">
                    {profile.user_stats.reputation}
                  </div>
                </div>
              </div>

              {/* Views Info Item */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl border bg-card/50">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Eye className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Views</div>
                  <div className="text-sm font-bold tracking-tight truncate">
                    {profile.user_stats.views}
                  </div>
                </div>
              </div>
            </div>

            {/* Upvotes Horizontal Metric Banner */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border bg-card/50 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ThumbsUp className="h-4 w-4 text-indigo-500" />
                <span>Total Upvotes Secured</span>
              </div>
              <span className="font-bold text-foreground">
                {profile.user_stats.upvotes}
              </span>
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Social Vectors Ecosystem Compartment */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground/90">
              Ecosystem & Socials
            </h3>
            <div className="flex flex-wrap gap-2">
              <SocialLinks {...profile.social_links} />
            </div>
          </div>

          {/* Squad Grid Interactive Container Grid */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-semibold text-foreground/90">
              User Active in Squads
            </h3>
            <SquadGrid squads={joinedSquads || []} isLoading={isSquadLoading} />
          </div>
        </div>
      </aside>
    </div>
  );
}
