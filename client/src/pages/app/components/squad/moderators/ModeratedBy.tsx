import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Shield, Crown } from "lucide-react";

type ModeratedByProps = {
  moderators: SquadMember[];
};

export function ModeratedBy({ moderators }: ModeratedByProps) {
  if (!moderators || moderators.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-8 border-t border-border">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-foreground">
          Moderation Team
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {moderators.map((moderator) => (
          <div
            key={moderator.userDetails.userId}
            className="group relative rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800"
          >
            {/* Role Badge */}
            <div className="absolute top-3 right-3">
              {moderator.role === "admin" ? (
                <Badge className="bg-indigo-600 hover:bg-indigo-700 gap-1">
                  <Crown className="w-3 h-3" />
                  Admin
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="gap-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                >
                  <Shield className="w-3 h-3" />
                  Moderator
                </Badge>
              )}
            </div>

            {/* Avatar and Info */}
            <div className="flex items-center gap-3 mt-2">
              <Avatar className="h-12 w-12 border-2 border-indigo-100 dark:border-indigo-900">
                <AvatarImage
                  src={moderator.userDetails.avatar || ""}
                  alt={moderator.userDetails.name}
                />
                <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-semibold">
                  {moderator.userDetails.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">
                  {moderator.userDetails.name}
                </h4>
                <p className="text-sm text-muted-foreground truncate">
                  {moderator.userDetails.email}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile-optimized avatar stack view for smaller screens */}
      <div className="mt-6 lg:hidden">
        <p className="text-sm text-muted-foreground mb-3">Quick view:</p>
        <div className="flex flex-wrap gap-2">
          {moderators.map((moderator) => (
            <Avatar
              key={moderator.userDetails.userId}
              className="h-10 w-10 border-2 border-indigo-200 dark:border-indigo-800 cursor-pointer transition-transform hover:scale-110"
              title={moderator.userDetails.name}
            >
              <AvatarImage
                src={moderator.userDetails.avatar || ""}
                alt={moderator.userDetails.name}
              />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-xs font-semibold">
                {moderator.userDetails.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </div>
  );
}
