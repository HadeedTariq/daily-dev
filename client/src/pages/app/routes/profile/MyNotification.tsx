import { followerApi } from "@/lib/axios";
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ActorDetails {
  username: string;
  avatar: string;
  name: string;
}

interface Notification {
  id: number;
  user_id: number;
  actor_id: number;
  action_type: "follow" | "unfollow";
  created_at: string;
  is_read: boolean;
  actor_details: ActorDetails;
}

const MyNotification = () => {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["getMyNotifications"],
    queryFn: async () => {
      const { data } = await followerApi.get("/notifications");
      return data as Notification[];
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: markAllAsRead } = useMutation({
    mutationKey: ["markAllAsRead"],
    mutationFn: async () => {
      const { data } = await followerApi.put("/read-notifications");
      return data;
    },
    onSuccess: () => {
      toast({
        title: "All notifications have been marked as read",
        variant: "default",
        duration: 2000,
      });

      queryClient.invalidateQueries([
        "getMyNotifications",
      ] as InvalidateQueryFilters);
    },
    onError: (err: any) => {
      toast({
        title:
          err.response.data.message || "Failed to mark notifications as read",
        variant: "destructive",
        duration: 2000,
      });
    },
  });

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className="w-[77%]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Notifications</CardTitle>
          <Button variant="outline" onClick={() => markAllAsRead()}>
            Mark all as read
          </Button>
        </CardHeader>
        <CardContent>
          {notifications?.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-center space-x-4 p-4 ${
                notification.is_read ? "opacity-50" : ""
              }`}
            >
              <Avatar>
                <AvatarImage
                  src={notification.actor_details.avatar}
                  alt={notification.actor_details.name}
                />
                <AvatarFallback>
                  {notification.actor_details.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-bold">
                    {notification.actor_details.name}
                  </span>{" "}
                  {notification.action_type === "follow"
                    ? "started following you"
                    : "unfollowed you"}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(notification.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              {notification.is_read ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <Bell
                className={`h-4 w-4 ${
                  notification.is_read ? "text-gray-400" : "text-blue-500"
                }`}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyNotification;
