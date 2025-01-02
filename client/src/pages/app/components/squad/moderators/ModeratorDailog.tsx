import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ModeratorCard } from "./ModeratorCard";

interface ModeratorDialogProps {
  moderators: SquadMember[];
  remainingCount: number;
}

export function ModeratorDialog({
  moderators,
  remainingCount,
}: ModeratorDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-[100px] w-[250px]">
          +{remainingCount} more
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>All Moderators</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {moderators.map((moderator) => (
            <ModeratorCard
              key={moderator.userDetails.userId}
              moderator={moderator}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
