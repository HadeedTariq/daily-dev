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
import SquadGrid from "../components/SquadGrid";
import { useGetJoinedSquads } from "../hooks/useGetJoinedSquads";
import { useState } from "react";
import { FollowersDialog } from "../components/profile/FollowersDialog";
import { FollowingsDialog } from "../components/profile/FollowingsDialog";

export default function Profile() {
  const [isFollowersDialogOpen, setIsFollowersDialogOpen] = useState(false);

  const handleFollowersClick = () => {
    setIsFollowersDialogOpen(true);
  };
  const [isFollowingsDialogOpen, setIsFollowingsDialogOpen] = useState(false);

  const handleFollowingsClick = () => {
    setIsFollowingsDialogOpen(true);
  };
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
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      <header className="bg-background border-b w-full md:w-auto md:flex-grow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <ProfileHeader />
        </div>
        <Outlet />
      </header>
      <div className="w-full md:w-[400px] lg:w-[450px] p-4 min-h-screen  md:overflow-y-auto">
        <Card className="min-h-screen">
          <div className="flex flex-row items-center w-full gap-4 p-3">
            <h1 className="text-xl">Profile</h1>
            <ShareProfile />
          </div>
          <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                @{profile.username}
              </p>
              {profile.profession && (
                <Badge variant="secondary" className="mt-2">
                  {profile.profession}
                </Badge>
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
                <p className="cursor-pointer" onClick={handleFollowersClick}>
                  Followers: {profile.user_stats.followers}
                </p>
                <FollowersDialog
                  isOpen={isFollowersDialogOpen}
                  onClose={() => setIsFollowersDialogOpen(false)}
                />
                <p className="cursor-pointer" onClick={handleFollowingsClick}>
                  Followings: {profile.user_stats.following}
                </p>
                <FollowingsDialog
                  isOpen={isFollowingsDialogOpen}
                  onClose={() => setIsFollowingsDialogOpen(false)}
                />
                <p>Reputation: {profile.user_stats.reputation}</p>
                <p>Views: {profile.user_stats.views}</p>
                <p>Upvotes: {profile.user_stats.upvotes}</p>
              </div>
            </div>
            <div className="my-2">
              <h3 className="font-semibold mb-2">Social Links</h3>
              <div className="flex flex-wrap gap-2">
                <SocialLinks {...profile.social_links} />
              </div>
            </div>
            <Link to="/editProfile" className="block">
              <Button className="w-full">Edit Profile</Button>
            </Link>
            <div className="text-xs mt-3 text-muted-foreground">
              Member since: {new Date(profile.created_at).toLocaleDateString()}
            </div>
            <div className="flex flex-col gap-4">
              <h2>User active in squads</h2>
              <SquadGrid
                squads={joinedSquads || []}
                isLoading={isSquadLoading}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
