import { Link } from "react-router-dom";
import { Users2, ShieldAlert } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface SquadGridProps {
  squads: any[]; // Kept open to preserve your precise internal JoinedSquad definitions
  isLoading: boolean;
}

export default function SquadGrid({ squads, isLoading }: SquadGridProps) {
  // Production-grade Skeleton States matching the new card shape
  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[140px] p-3 rounded-xl border border-border/50 bg-card/30 space-y-2.5"
          >
            <Skeleton className="h-10 w-10 rounded-xl mx-auto bg-muted/60" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-3/4 mx-auto bg-muted/60" />
              <Skeleton className="h-2 w-1/2 mx-auto bg-muted/60" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback state if the user hasn't joined any squads yet
  if (!squads || squads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed rounded-xl bg-card/10">
        <Users2 className="h-6 w-6 text-muted-foreground/50 mb-2 stroke-[1.5]" />
        <p className="text-xs font-medium text-muted-foreground">
          Not active in any squads yet
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x w-full hide-scrollbar">
      {squads.map((squad) => (
        <Link
          key={squad.squad_id}
          to={`/squads/${squad.squad_handle}`}
          className="snap-item shrink-0 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
        >
          <div className="w-[140px] p-3 text-center rounded-xl border border-border/60 bg-card/40 hover:bg-indigo-500/[0.02] dark:hover:bg-indigo-400/[0.02] hover:border-indigo-500/30 transition-all duration-200 group select-none relative">
            {/* Squad Avatar Container with rounded-xl for premium platform aesthetics */}
            <div className="relative w-11 h-11 mx-auto mb-2.5">
              <Avatar className="w-11 h-11 rounded-xl border-none ring-2 ring-border group-hover:ring-indigo-500/40 transition-all shadow-sm">
                <AvatarImage
                  src={squad.squad_thumbnail}
                  alt={`${squad.squad_name} thumbnail`}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl font-semibold text-xs">
                  {squad.squad_name
                    ? squad.squad_name.substring(0, 2).toUpperCase()
                    : "SQ"}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Metas */}
            <div className="space-y-0.5">
              <p className="text-xs font-bold tracking-tight text-foreground/90 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {squad.squad_name}
              </p>
              <p className="text-[10px] font-medium text-muted-foreground/70 truncate">
                @{squad.squad_handle}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
