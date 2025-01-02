import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export function ModeratorCard({ moderator }: { moderator: SquadMember }) {
  return (
    <Card className="w-[250px]">
      <CardContent className="flex items-center space-x-4 p-4">
        <Avatar>
          <AvatarImage
            src={moderator.userDetails.avatar || ""}
            alt={moderator.userDetails.username}
          />
          <AvatarFallback>
            {moderator.userDetails.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{moderator.userDetails.username}</h3>
          <p className="text-sm text-muted-foreground">{moderator.role}</p>
        </div>
      </CardContent>
    </Card>
  );
}
