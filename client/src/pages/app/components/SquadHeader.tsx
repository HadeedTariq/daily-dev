import { Badge } from "@/components/ui/badge";
import { Lock, Globe } from "lucide-react";
import SquadManagement from "./squad/SquadManagement";
import Moderators from "./squad/moderators/Moderators";
import SquadMembersCard from "./squad/members/MemberCard";

export default function SquadHeader({ squad }: { squad: SquadDetails }) {
  const rolePriority: any = {
    admin: 1,
    moderator: 2,
    member: 3,
  };
  let squadMembers = [...squad.squad_members];
  squadMembers.sort((a, b) => rolePriority[a.role] - rolePriority[b.role]);

  const actualSquad = { ...squad, squad_members: squadMembers };

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
      </div>
      <div className="flex justify-start">
        <SquadMembersCard
          members={actualSquad.squad_members}
          adminId={actualSquad.admin_id}
          squadId={actualSquad.squad_id}
          squadHandle={actualSquad.squad_handle}
        />
        <SquadManagement adminId={actualSquad.admin_id} squad={squad} />
      </div>
      <p className="text-gray-700">{actualSquad.description}</p>
      <Moderators members={actualSquad.squad_members} />
    </div>
  );
}
