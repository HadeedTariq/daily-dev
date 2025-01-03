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

type MembersDialogProps = {
  isOpen: boolean;
  adminId: number;
  onClose: () => void;
  members: SquadMember[];
};

export const MembersDialog = ({
  isOpen,
  onClose,
  members,
  adminId,
}: MembersDialogProps) => {
  const { user } = useFullApp();

  const isUserAdmin = user?.id === adminId;
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
                            <Button variant={"outline"} size={"sm"}>
                              Make Member
                            </Button>
                            <Button variant={"default"} size={"sm"}>
                              Make Admin
                            </Button>
                          </>
                        )}
                        {member.role === "member" && (
                          <>
                            <Button variant={"outline"} size={"sm"}>
                              Make Moderator
                            </Button>
                            <Button variant={"destructive"} size={"sm"}>
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
