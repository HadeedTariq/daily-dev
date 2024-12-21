import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MyReplies() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Reply to: Interesting Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is my reply to the interesting topic.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Reply to: Another Discussion</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Here's my thoughts on another discussion.</p>
        </CardContent>
      </Card>
    </div>
  );
}
