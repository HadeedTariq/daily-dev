import { Badge } from "@/components/ui/badge";
import { Lock, Globe } from "lucide-react";
import SquadManagement from "./squad/SquadManagement";
import Moderators from "./squad/moderators/Moderators";

export default function SquadHeader({ squad }: { squad: SquadDetails }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">{squad.squad_name}</h1>
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
        <SquadManagement adminId={squad.admin_id} />
      </div>
      <p className="text-gray-700">{squad.description}</p>
      <Moderators members={squad.squad_members} />
    </div>
  );
}
