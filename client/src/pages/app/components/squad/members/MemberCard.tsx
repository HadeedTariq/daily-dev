import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { MembersDialog } from "./MemberDialog";

type SquadMembersCardProps = {
  members: SquadMember[];
  adminId: number;
  squadId: number;
  squadHandle: string;
};

export default function SquadMembersCard({
  members,
  adminId,
  squadId,
  squadHandle,
}: SquadMembersCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCardClick = () => {
    setIsDialogOpen(true);
  };

  const displayedMembers = members.slice(0, 5);
  const remainingCount = Math.max(0, members.length - 5);

  return (
    <>
      <Card className="w-full transition-all duration-300 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800 cursor-pointer overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Avatars Section */}
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Avatar Stack */}
                <div className="flex -space-x-3 overflow-visible">
                  {displayedMembers.map((member) => (
                    <Avatar
                      key={member.userDetails.userId}
                      className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-background transition-transform hover:scale-110 hover:z-10"
                      title={member.userDetails.name}
                    >
                      <AvatarImage
                        src={member.userDetails.avatar || ""}
                        alt={member.userDetails.name}
                      />
                      <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-semibold text-xs sm:text-sm">
                        {member.userDetails.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>

                {/* Member Count Badge */}
                {remainingCount > 0 && (
                  <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs sm:text-sm font-semibold border-2 border-background transition-transform hover:scale-110">
                    +{remainingCount}
                  </div>
                )}
              </div>

              {/* Info Text - Hidden on mobile, shown on larger screens */}
              <p className="hidden sm:block text-sm text-muted-foreground mt-3">
                {members.length} {members.length === 1 ? "member" : "members"}{" "}
                in this squad
              </p>
            </div>

            {/* View All Button */}
            <Button
              onClick={handleCardClick}
              variant="outline"
              className="w-full sm:w-auto gap-2 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
            >
              <span className="text-sm sm:text-base">View All</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Info Text */}
          <p className="sm:hidden text-xs text-muted-foreground mt-3">
            {members.length} {members.length === 1 ? "member" : "members"}
          </p>
        </CardContent>
      </Card>

      <MembersDialog
        adminId={adminId}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        squadId={squadId}
        squadHandle={squadHandle}
        members={members}
      />
    </>
  );
}
