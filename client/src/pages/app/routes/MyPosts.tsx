import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function MyPosts() {
  return (
    <div className="space-y-4">
      <Link to={"/post/create"}>
        <Button>New Post</Button>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>My First Post</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the content of my first post.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Another Post</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Here's another post I made.</p>
        </CardContent>
      </Card>
    </div>
  );
}
