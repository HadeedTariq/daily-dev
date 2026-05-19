import { ModeratedBy } from "./ModeratedBy";

type ModeratorsProps = {
  members: SquadMember[];
};

export default function Moderators({ members }: ModeratorsProps) {
  const moderators = members.filter(
    (member) => member.role === "moderator" || member.role === "admin",
  );

  return (
    <div className="w-full">
      <ModeratedBy moderators={moderators} />
    </div>
  );
}
