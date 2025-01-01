import { useParams } from "react-router-dom";

import { SquadPage } from "../components/squad/SquadPage";
import { useSquadMain } from "../hooks/useSquadMain";

export default function SquadMainPage() {
  const { squad_handle } = useParams();
  const { data: squadData, isLoading } = useSquadMain(squad_handle as string);
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (!squadData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Squad not found
      </div>
    );
  }

  return <SquadPage squad={squadData} />;
}
