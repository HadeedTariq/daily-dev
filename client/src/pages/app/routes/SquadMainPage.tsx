import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Users, Settings } from "lucide-react";
import SquadHeader from "../components/SquadHeader";
import SquadDetails from "../components/SquadDetails";
import SquadMembers from "../components/SquadMembers";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface Squad {
  id: number;
  name: string;
  squad_handle: string;
  description: string;
  category: "general" | "tech" | "sports" | "entertainment" | "other";
  is_public: boolean;
  admin_id: number;
  post_creation_allowed_to: "members" | "admins" | "everyone";
  invitation_permission: "members" | "admins" | "everyone";
  post_approval_required: boolean;
  created_at: string;
  updated_at: string;
}

export default function SquadMainPage() {
  const { squad_handle } = useParams();

  const {} = useQuery({
    queryKey: [`squad-${squad_handle}`],
    queryFn: async () => {
      const response = await fetch(`/api/squads/${squad_handle}`);
      if (!response.ok) {
        throw new Error("Failed to fetch squad");
      }
      return await response.json();
    },
  });

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Squad Details</CardTitle>
        </CardHeader>
        <CardContent>
          <SquadHeader squad={squad} />
          <SquadDetails squad={squad} />
          <SquadMembers />
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Invite Members
            </Button>
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              Manage Squad
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
