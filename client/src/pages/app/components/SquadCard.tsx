import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export function SquadCard({ squad }: { squad: Squad }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant={squad.is_public ? "default" : "secondary"}>
            {squad.is_public ? "Public" : "Private"}
          </Badge>
          <Badge variant="outline">{squad.category}</Badge>
        </div>
        <CardTitle className="mt-2">
          <Link to={`/squad/${squad.squad_handle}`} className="hover:underline">
            {squad.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {squad.description}
        </p>
        <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            {new Date(squad.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/squads/${String(squad.squad_handle.trim())}`}>
          <Button className="w-full">View Squad</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
