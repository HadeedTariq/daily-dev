import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { followerApi } from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useFullApp } from "@/store/hooks/useFullApp";
type Follower = {
  id: number;
  username: string;
  name: string;
  avatar: string;
  current_user_follow: boolean;
};

type UserFollowingsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
};

export const UserFollowingsDialog = ({
  isOpen,
  onClose,
  userId,
}: UserFollowingsDialogProps) => {
  const { user } = useFullApp();
  const queryClient = useQueryClient();
  const { data: followings, isLoading } = useQuery({
    queryKey: [`getUserFollowings_${userId}`],
    queryFn: async () => {
      const { data } = await followerApi.get(
        `/user-followings?userId=${userId}`
      );
      return data as Follower[];
    },
  });

  const { mutate: unFollowUser, isPending } = useMutation({
    mutationKey: ["unfollowUser"],
    mutationFn: async (followedId: number) => {
      const { data } = await followerApi.put(`/unfollow`, { followedId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([
        `getUserFollowings_${userId}`,
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
        `getUserFollowings_${userId}`,
      ] as InvalidateQueryFilters);
    },
    onError: (err: any) => {
      toast({
        title: err.response.data.message || "Failed to follow a user",
        variant: "destructive",
      });
    },
  });
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            User Followings
          </DialogTitle>
          <DialogDescription>
            Here's a list of user followings
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-6 max-h-[60vh] pr-4">
          {isLoading ? (
            <h1>Loading...</h1>
          ) : (
            <div className="space-y-4">
              {followings?.map((follower) => (
                <div className="flex justify-between items-center">
                  <div
                    key={follower.id}
                    className="flex items-center space-x-4 p-2 rounded-lg transition-all duration-200 ease-in-out "
                  >
                    <Avatar className="h-12 w-12 border-2 border-primary transition-all duration-200 ease-in-out group-hover:border-secondary">
                      <AvatarImage src={follower.avatar} alt={follower.name} />
                      <AvatarFallback className="text-lg font-medium">
                        {follower.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 ease-in-out">
                        <p>{follower.name}</p>
                        <p>@{follower.username}</p>
                      </div>
                    </div>
                  </div>
                  {follower.id !== user?.id &&
                    (follower.current_user_follow ? (
                      <Button
                        variant={"destructive"}
                        size={"sm"}
                        onClick={() => {
                          unFollowUser(follower.id);
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
                          followUser(follower.id);
                        }}
                        disabled={isFollowingPending}
                      >
                        Follow
                      </Button>
                    ))}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
