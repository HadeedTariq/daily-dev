import { CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Briefcase,
  Building2,
  Calendar,
  Edit3,
  Users,
  Eye,
  Award,
  ThumbsUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/lib/axios";
import { SocialLinks } from "../components/SocialLinks";
import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProfile } from "@/reducers/fullAppReducer";
import ShareProfile from "../components/ShareProfile";
import { ProfileHeader } from "../components/ProfileHeader";
import SquadGrid from "../components/SquadGrid";
import { useGetJoinedSquads } from "../hooks/useGetJoinedSquads";
import { useState } from "react";
import { FollowersDialog } from "../components/profile/FollowersDialog";
import { FollowingsDialog } from "../components/profile/FollowingsDialog";
import { Separator } from "@/components/ui/separator";
import { formatSocialNumber } from "@/lib/utils";

export default function Profile() {
  const [isFollowersDialogOpen, setIsFollowersDialogOpen] = useState(false);

  const [isFollowingsDialogOpen, setIsFollowingsDialogOpen] = useState(false);

  const dispatch = useDispatch();
  const { isLoading, data: profile } = useQuery({
    queryKey: ["getProfile"],
    queryFn: async () => {
      const { data } = await profileApi.get("/");
      dispatch(setProfile(data.profile as UserProfile));
      return data.profile as UserProfile;
    },
  });
  const { data: joinedSquads, isLoading: isSquadLoading } =
    useGetJoinedSquads();

  if (isLoading) return <div>Loading...</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-background text-foreground selection:bg-indigo-500/30">
      {/* LEFT AREA: Sticky Global Header & Feed/Outlet Content */}
      <div className="flex-1 flex flex-col min-w-0 order-2 lg:order-1">
        {/* Global/Feed Nav Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <ProfileHeader />
          </div>
        </header>

        {/* Core Main Viewport Container (Feed, Posts, History etc.) */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* RIGHT SIDEBAR: Responsive Profile Presentation Sidebar */}
      <aside className="w-full lg:w-[380px] xl:w-[420px] lg:border-l bg-card/30 lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto order-1 lg:order-2 border-b lg:border-b-0 hide-scrollbar">
        <div className="p-4 sm:p-6 space-y-6">
          {/* Header Action Row */}
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg font-bold tracking-tight text-muted-foreground/80 uppercase text-xs">
              Developer Profile
            </h2>
            <ShareProfile />
          </div>

          {/* Profile Identity Card */}
          <div className="flex flex-col items-center text-center sm:text-left sm:flex-row sm:items-start gap-4">
            <Avatar className="h-20 w-20 ring-4 ring-indigo-500/10 border-2 border-background shadow-xl">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="bg-indigo-600 text-white font-medium text-xl">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <CardTitle className="text-2xl font-bold tracking-tight">
                  {profile.name}
                </CardTitle>
                {profile.profession && (
                  <Badge
                    variant="secondary"
                    className="w-max mx-auto sm:mx-0 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-none hover:bg-indigo-500/20"
                  >
                    {profile.profession}
                  </Badge>
                )}
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                @{profile.username}
              </p>
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Detailed Metadata / About */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground/90">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {profile.about.bio || "No professional bio provided yet."}
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
                  Joined{" "}
                  {new Date(profile.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Analytical Interactive Stats Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground/90">
              Platform Performance
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Followers */}
              <button
                onClick={() => setIsFollowersDialogOpen(true)}
                className="flex items-center gap-3 p-2.5 rounded-xl border bg-card/50 hover:bg-accent/50 hover:text-accent-foreground text-left transition-all group duration-200"
              >
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                  <Users className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Followers</div>

                  <div className="text-sm font-bold tracking-tight truncate">
                    {formatSocialNumber(profile.user_stats.followers)}
                  </div>
                </div>
              </button>

              {/* Following */}
              <button
                onClick={() => setIsFollowingsDialogOpen(true)}
                className="flex items-center gap-3 p-2.5 rounded-xl border bg-card/50 hover:bg-accent/50 hover:text-accent-foreground text-left transition-all group duration-200"
              >
                <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:scale-105 transition-transform">
                  <Users className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Following</div>

                  <div className="text-sm font-bold tracking-tight truncate">
                    {formatSocialNumber(profile.user_stats.following)}
                  </div>
                </div>
              </button>

              {/* Reputation */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl border bg-card/50">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Award className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">
                    Reputation
                  </div>

                  <div className="text-sm font-bold tracking-tight truncate">
                    {formatSocialNumber(profile.user_stats.reputation)}
                  </div>
                </div>
              </div>

              {/* Views */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl border bg-card/50">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Eye className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Views</div>

                  <div className="text-sm font-bold tracking-tight truncate">
                    {formatSocialNumber(profile.user_stats.views)}
                  </div>
                </div>
              </div>
            </div>

            {/* Upvotes */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border bg-card/50 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ThumbsUp className="h-4 w-4 text-indigo-500" />
                <span>Total Upvotes Secured</span>
              </div>

              <span className="font-bold">
                {formatSocialNumber(profile.user_stats.upvotes)}
              </span>
            </div>
          </div>

          {/* Dialog Windows */}
          <FollowersDialog
            isOpen={isFollowersDialogOpen}
            onClose={() => setIsFollowersDialogOpen(false)}
          />
          <FollowingsDialog
            isOpen={isFollowingsDialogOpen}
            onClose={() => setIsFollowingsDialogOpen(false)}
          />

          <Separator className="bg-border/60" />

          {/* Social Vectors Ecosystem */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground/90">
              Ecosystem & Socials
            </h3>
            <div className="flex flex-wrap gap-2">
              <SocialLinks {...profile.social_links} />
            </div>
          </div>

          {/* Squad Grid Interactive Compartment */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-semibold text-foreground/90">
              Active Squads
            </h3>
            <SquadGrid squads={joinedSquads || []} isLoading={isSquadLoading} />
          </div>

          {/* Primary Call to Action */}
          <Link to="/editProfile" className="block pt-2">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white shadow-md transition-all font-medium py-5 rounded-xl">
              <Edit3 className="mr-2 h-4 w-4" /> Edit Developer Profile
            </Button>
          </Link>
        </div>
      </aside>
    </div>
  );
}
