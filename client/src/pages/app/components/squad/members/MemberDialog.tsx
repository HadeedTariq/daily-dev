import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type MembersDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  members: SquadMember[];
};

export const MembersDialog = ({
  isOpen,
  onClose,
  members,
}: MembersDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Squad Members</DialogTitle>
        <DialogDescription>
          Here's a list of all squad members.
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {members.map((member) => (
          <div
            key={member.userDetails.userId}
            className="flex items-center space-x-4"
          >
            <Avatar>
              <AvatarImage
                src={member.userDetails.avatar || ""}
                alt={member.userDetails.name}
              />
              <AvatarFallback>
                {member.userDetails.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span>{member.userDetails.name}</span>
          </div>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);
