import { ModeratorCard } from "./ModeratorCard";
import { ModeratorDialog } from "./ModeratorDailog";

interface ModeratedByProps {
  moderators: SquadMember[];
}

export function ModeratedBy({ moderators }: ModeratedByProps) {
  const displayedModerators = moderators.slice(0, 4);
  const remainingCount = Math.max(0, moderators.length - 4);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Moderated by</h2>
      <div className="flex flex-wrap gap-4">
        {displayedModerators.map((moderator) => (
          <ModeratorCard
            key={moderator.userDetails.userId}
            moderator={moderator}
          />
        ))}
        {remainingCount > 0 && (
          <ModeratorDialog
            moderators={moderators}
            remainingCount={remainingCount}
          />
        )}
      </div>
    </div>
  );
}
