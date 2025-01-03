import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MembersDialog } from "./MemberDialog";

type SquadMembersCardProps = {
  members: SquadMember[];
  adminId: number;
};
export default function SquadMembersCard({
  members,
  adminId,
}: SquadMembersCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCardClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="w-fit">
      <Card
        className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
        onClick={handleCardClick}
      >
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Squad Members</h2>
          <div className="flex -space-x-4 overflow-hidden">
            {members.slice(0, 4).map((member) => (
              <Avatar
                key={member.userDetails.userId}
                className="border-2 border-background"
              >
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
            ))}
            {members.length > 4 && (
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-sm font-medium text-gray-600 border-2 border-background">
                +{members.length - 4}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <MembersDialog
        adminId={adminId}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        members={members}
      />
    </div>
  );
}
