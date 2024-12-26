import { Badge } from "@/components/ui/badge";
import { Lock, Globe } from "lucide-react";

interface SquadHeaderProps {
  squad: {
    name: string;
    squad_handle: string;
    description: string;
    is_public: boolean;
    category: string;
  };
}

export default function SquadHeader({ squad }: SquadHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">{squad.name}</h1>
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-gray-500">@{squad.squad_handle}</span>
        <Badge variant="outline">
          {squad.is_public ? (
            <Globe className="h-3 w-3 mr-1" />
          ) : (
            <Lock className="h-3 w-3 mr-1" />
          )}
          {squad.is_public ? "Public" : "Private"}
        </Badge>
        <Badge>{squad.category}</Badge>
      </div>
      <p className="text-gray-700">{squad.description}</p>
    </div>
  );
}
