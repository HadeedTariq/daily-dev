import { Link } from "react-router-dom";

interface SquadGridProps {
  squads: JoinedSquad[];
  isLoading: boolean;
}

export default function SquadGrid({ squads, isLoading }: SquadGridProps) {
  if (isLoading) return <h1>Loading...</h1>;
  return (
    <div className="flex overflow-x-auto space-x-4 py-4 px-2 scrollbar-hide">
      {squads.map((squad) => (
        <Link key={squad.squad_id} to={`/squads/${squad.squad_handle}`}>
          <div className="flex-shrink-0 w-24 text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <img
                src={squad.squad_thumbnail}
                alt={`${squad.squad_name} thumbnail`}
                className="rounded-full border-2 border-gray-200"
              />
            </div>
            <p className="text-sm font-medium truncate">{squad.squad_name}</p>
            <p className="text-xs text-gray-500 truncate">
              @{squad.squad_handle}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
