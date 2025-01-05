import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Badge } from "@/components/ui/badge";
import { useFullApp } from "@/store/hooks/useFullApp";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { squadApi } from "@/lib/axios";

type MembersDialogProps = {
  isOpen: boolean;
  adminId: number;
  squadId: number;
  squadHandle: string;

  onClose: () => void;
  members: SquadMember[];
};

export const MembersDialog = ({
  isOpen,
  onClose,
  members,
  adminId,
  squadId,
  squadHandle,
}: MembersDialogProps) => {
  const { user } = useFullApp();
  const queryClient = useQueryClient();

  const isUserAdmin = user?.id === adminId;

  const { isPending, mutate: updateRole } = useMutation({
    mutationKey: [`update-role`],
    mutationFn: async ({
      role,
      user_id,
    }: {
      user_id: number;
      role: string;
    }) => {
      const { data } = await squadApi.put(`/${squadId}/make-${role}`, {
        user_id,
      });
      return data;
    },
    onSuccess: (data: any) => {
      toast({
        title: data.message || "Role updated successfully",
        description: "Your changes have been saved.",
      });
      queryClient.invalidateQueries([
        `squad-${squadHandle}`,
      ] as InvalidateQueryFilters);
    },
    onError: (error: any) => {
      toast({
        title: error.response.data.message || "Error updating role",
        variant: "destructive",
      });
    },
  });
  const { isPending: isRemovingPending, mutate: removeMember } = useMutation({
    mutationKey: [`remove-member`],
    mutationFn: async ({ user_id }: { user_id: number }) => {
      const { data } = await squadApi.put(`/${squadId}/remove-member`, {
        user_id,
      });
      return data;
    },
    onSuccess: (data: any) => {
      toast({
        title: data.message || "Removed Member successfully",
        description: "Your changes have been saved.",
      });
      queryClient.invalidateQueries([
        `squad-${squadHandle}`,
      ] as InvalidateQueryFilters);
    },
    onError: (error: any) => {
      toast({
        title: error.response.data.message || "Error removing member",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Squad Members
          </DialogTitle>
          <DialogDescription>
            Here's a list of all squad members and their roles.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-6 max-h-[60vh] pr-4">
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.userDetails.userId}
                className="flex items-center space-x-4 p-2 rounded-lg transition-all duration-200 ease-in-out "
              >
                <Avatar className="h-12 w-12 border-2 border-primary transition-all duration-200 ease-in-out group-hover:border-secondary">
                  <AvatarImage
                    src={member.userDetails.avatar || ""}
                    alt={member.userDetails.name}
                  />
                  <AvatarFallback className="text-lg font-medium">
                    {member.userDetails.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 ease-in-out">
                    <p>{member.userDetails.name}</p>
                    {isUserAdmin && (
                      <div className="flex flex-wrap gap-2">
                        {member.role === "moderator" && (
                          <>
                            <Button
                              variant={"outline"}
                              size={"sm"}
                              disabled={isPending}
                              onClick={() =>
                                updateRole({
                                  user_id: member.userDetails.userId,
                                  role: "member",
                                })
                              }
                            >
                              Make Member
                            </Button>
                            <Button
                              variant={"default"}
                              size={"sm"}
                              disabled={isPending}
                              onClick={() =>
                                updateRole({
                                  user_id: member.userDetails.userId,
                                  role: "admin",
                                })
                              }
                            >
                              Make Admin
                            </Button>
                          </>
                        )}
                        {member.role === "member" && (
                          <>
                            <Button
                              variant={"outline"}
                              size={"sm"}
                              disabled={isPending}
                              onClick={() =>
                                updateRole({
                                  user_id: member.userDetails.userId,
                                  role: "moderator",
                                })
                              }
                            >
                              Make Moderator
                            </Button>
                            <Button
                              variant={"destructive"}
                              size={"sm"}
                              disabled={isRemovingPending}
                              onClick={() =>
                                removeMember({
                                  user_id: member.userDetails.userId,
                                })
                              }
                            >
                              Remove
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <Badge
                    variant="outline"
                    className="mt-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200 ease-in-out"
                  >
                    {member.role}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
