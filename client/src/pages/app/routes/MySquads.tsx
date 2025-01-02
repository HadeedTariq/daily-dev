import { Button } from "@/components/ui/button";

import { squadApi } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { SquadCard } from "../components/SquadCard";

export default function MySquads() {
  const { data: squads, isLoading } = useQuery({
    queryKey: ["getMySquads"],
    queryFn: async () => {
      const { data } = await squadApi.get("/my");
      return data as SquadDetails[];
    },
  });
  if (isLoading) return <h1>Loading...</h1>;
  return (
    <div className="space-y-4">
      <Link to={"/squads/create"}>
        <Button>Create Squad</Button>
      </Link>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {squads?.map((squad) => (
          <SquadCard key={squad.squad_handle} squad={squad} />
        ))}
      </div>
    </div>
  );
}
