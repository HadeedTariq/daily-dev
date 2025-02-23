import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, Eye } from "lucide-react";

export function PostSkeletonCard() {
  return (
    <Card className="w-[400px] h-[500px]">
      <CardHeader className="relative p-0">
        <Skeleton className="w-full h-48 rounded-t-lg" />
        <div className="absolute top-2 right-2">
          <Skeleton className="h-9 w-24" />{" "}
          {/* Placeholder for "Read Post" button */}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center space-x-2 mb-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-2" /> {/* Title placeholder */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <Badge key={i} variant="secondary">
              <Skeleton className="h-4 w-16" />
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <ChevronUp className="h-4 w-4 text-gray-300" />
          <Skeleton className="h-4 w-8" />
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4 text-gray-300" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />{" "}
      </CardFooter>
    </Card>
  );
}
