import { ModeratedBy } from "./ModeratedBy";

type ModeratorsProps = {
  members: SquadMember[];
};
export default function Moderators({ members }: ModeratorsProps) {
  const moderators = members.filter(
    (member) => member.role === "moderator" || member.role === "admin"
  );
  return (
    <main className="container mx-auto p-4">
      <ModeratedBy moderators={moderators} />
    </main>
  );
}
