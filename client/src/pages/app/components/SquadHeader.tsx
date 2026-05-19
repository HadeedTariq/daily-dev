import { Badge } from "@/components/ui/badge";
import { Lock, Globe, Users } from "lucide-react";
import SquadMembersCard from "./squad/members/MemberCard";
import Moderators from "./squad/moderators/Moderators";
import SquadSettingsMenu from "./squad/SquadManagement";

export default function SquadHeader({ squad }: { squad: SquadDetails }) {
  const rolePriority: any = {
    admin: 1,
    moderator: 2,
    member: 3,
  };

  let squadMembers = [...(squad.squad_members || [])];
  squadMembers?.sort((a, b) => rolePriority[a.role] - rolePriority[b.role]);

  const actualSquad = { ...squad, squad_members: squadMembers };

  return (
    <div className="w-full space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground break-words">
              {squad.squad_name}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <span className="text-sm text-muted-foreground">
                @{squad.squad_handle}
              </span>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="gap-1.5 w-fit border-indigo-200 dark:border-indigo-800"
                >
                  {squad.is_public ? (
                    <>
                      <Globe className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Public</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Private</span>
                    </>
                  )}
                </Badge>
                <Badge className="w-fit bg-indigo-600 hover:bg-indigo-700">
                  {squad.category}
                </Badge>
              </div>
            </div>
          </div>
          <SquadSettingsMenu adminId={actualSquad.admin_id} squad={squad} />
        </div>

        {/* Description */}
        {actualSquad.description && (
          <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
            {actualSquad.description}
          </p>
        )}
      </div>

      {/* Members Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-foreground">
            Squad Members
          </h2>
          <span className="ml-auto text-sm text-muted-foreground">
            {actualSquad.squad_members?.length || 0} members
          </span>
        </div>
        <SquadMembersCard
          members={actualSquad.squad_members}
          adminId={actualSquad.admin_id}
          squadId={actualSquad.squad_id}
          squadHandle={actualSquad.squad_handle}
        />
      </div>

      {/* Moderators Section */}
      <Moderators members={actualSquad.squad_members} />
    </div>
  );
}
