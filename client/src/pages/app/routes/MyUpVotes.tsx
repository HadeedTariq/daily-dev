import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp } from "lucide-react";

export default function MyUpvotes() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ThumbsUp className="mr-2" size={18} />
            Upvoted Post: Exciting News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>You upvoted this exciting news post.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ThumbsUp className="mr-2" size={18} />
            Upvoted Post: Tech Update
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>You upvoted this tech update post.</p>
        </CardContent>
      </Card>
    </div>
  );
}
