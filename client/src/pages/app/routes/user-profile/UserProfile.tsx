import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="flex flex-row  w-full">
      <header className="bg-background border-b w-full">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <UserProfileHeader />
        </div>
        <Outlet
          context={{
            userId: profile.id,
          }}
        />
      </header>
      <div className="absolute top-10 right-0 h-full w-full max-w-md p-4 overflow-y-auto">
        <Card className="h-full">
          <div className="flex justify-between items-center p-3">
            <div className="flex flex-row items-center w-full gap-4 p-3">
              <h1 className="text-xl">Profile</h1>
              <ShareProfile />
            </div>
            {profile.current_user_follow ? (
              <Button
                variant={"destructive"}
                size={"sm"}
                onClick={() => {
                  unFollowUser(profile.id);
                }}
                disabled={isPending}
              >
                UnFollow
              </Button>
            ) : (
              <Button
                variant={"default"}
                size={"sm"}
                onClick={() => {
                  followUser(profile.id);
                }}
                disabled={isFollowingPending}
              >
                Follow
              </Button>
            )}
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
                <p
                  className="cursor-pointer"
                  onClick={() => handleFollowersClick()}
                >
                  Followers: {profile.user_stats.followers}
                </p>
                <UserFollowersDialog
                  userId={profile.id}
                  isOpen={isFollowersDialogOpen}
                  onClose={() => setIsFollowersDialogOpen(false)}
                />
                <p
                  className="cursor-pointer"
                  onClick={() => handleFollowingsClick()}
                >
                  Followings: {profile.user_stats.following}
                </p>
                <UserFollowingsDialog
                  userId={profile.id}
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
