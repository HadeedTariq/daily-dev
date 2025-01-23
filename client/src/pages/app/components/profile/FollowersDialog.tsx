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
import { useQuery } from "@tanstack/react-query";
type Follower = {
  id: number;
  username: string;
  name: string;
  avatar: string;
};

type FollowersDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const FollowersDialog = ({ isOpen, onClose }: FollowersDialogProps) => {
  const { data: followers, isLoading } = useQuery({
    queryKey: ["getMyFollowers"],
    queryFn: async () => {
      const { data } = await followerApi.get("/my-followers");
      return data as Follower[];
    },
  });
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">My Followers</DialogTitle>
          <DialogDescription>Here's a list of my followers</DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-6 max-h-[60vh] pr-4">
          {isLoading ? (
            <h1>Loading...</h1>
          ) : (
            <div className="space-y-4">
              {followers?.map((follower) => (
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
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
