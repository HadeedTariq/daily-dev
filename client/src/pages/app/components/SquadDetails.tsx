interface SquadDetailsProps {
  squad: {
    post_creation_allowed_to: string;
    invitation_permission: string;
    post_approval_required: boolean;
    created_at: string;
  };
}

export default function SquadDetails({ squad }: SquadDetailsProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Squad Settings</h2>
      <ul className="space-y-2">
        <li>
          <span className="font-medium">Post Creation: </span>
          {squad.post_creation_allowed_to}
        </li>
        <li>
          <span className="font-medium">Invitation Permission: </span>
          {squad.invitation_permission}
        </li>
        <li>
          <span className="font-medium">Post Approval Required: </span>
          {squad.post_approval_required ? "Yes" : "No"}
        </li>
        <li>
          <span className="font-medium">Created At: </span>
          {new Date(squad.created_at).toLocaleDateString()}
        </li>
      </ul>
    </div>
  );
}
