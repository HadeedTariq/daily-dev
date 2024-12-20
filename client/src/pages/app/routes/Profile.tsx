"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export default function DailyDevProfile() {
  const dispatch = useDispatch();
  const { isLoading, data: profile } = useQuery({
    queryKey: ["getProfile"],
    queryFn: async () => {
      const { data } = await profileApi.get("/");
      dispatch(setProfile(data.profile as UserProfile));
      return data.profile as UserProfile;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <div className="flex flex-row  w-full">
      <ProfileHeader />
      <Outlet />
      <div className="absolute top-10 right-0 h-full w-full max-w-md p-4 overflow-y-auto">
        <Card className="h-full">
          <div className="flex flex-row items-center w-full gap-4 p-3">
            <h1 className="text-xl">Profile</h1>

            <ShareProfile />
          </div>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                @{profile.username}
              </p>
              {profile.profession && (
                <Badge variant="secondary">{profile.profession}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-sm text-muted-foreground">
                {profile.about.bio || "No bio provided"}
              </p>
              {profile.about.company && (
                <p className="text-sm mt-1">Company: {profile.about.company}</p>
              )}
              {profile.about.job_title && (
                <p className="text-sm">Job Title: {profile.about.job_title}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Stats</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                <div>Followers: {profile.user_stats.followers}</div>
                <div>Following: {profile.user_stats.following}</div>
                <div>Reputation: {profile.user_stats.reputation}</div>
                <div>Views: {profile.user_stats.views}</div>
                <div>Upvotes: {profile.user_stats.upvotes}</div>
              </div>
            </div>
            <div className="my-2">
              <h3 className="font-semibold mb-2">Social Links</h3>
              <div className="flex flex-wrap gap-2">
                <SocialLinks {...profile.social_links} />
              </div>
            </div>
            <Link to={"/editProfile"} className="py-3">
              <Button>Edit Profile</Button>
            </Link>
            <div className="text-xs mt-3 text-muted-foreground">
              Member since: {new Date(profile.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
