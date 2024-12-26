import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SquadMembers() {
  // This is a placeholder. In a real application, you'd fetch and display actual members.
  const placeholderMembers = [
    { id: 1, name: "John Doe", avatar: "/placeholder.svg" },
    { id: 2, name: "Jane Smith", avatar: "/placeholder.svg" },
    { id: 3, name: "Bob Johnson", avatar: "/placeholder.svg" },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Squad Members</h2>
      <div className="flex space-x-2">
        {placeholderMembers.map((member) => (
          <Avatar key={member.id}>
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback>
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  );
}
