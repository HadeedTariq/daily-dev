import SquadHeader from "../SquadHeader";
import { PostList } from "./PostList";
import { SquadStats } from "./SquadStats";

export function SquadPage({ squad }: { squad: SquadDetails }) {
  return (
    <div className="min-h-screen ">
      <SquadHeader squad={squad} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
            <PostList posts={squad.squad_posts} />
          </div>
          <div>
            <SquadStats squad={squad} />
          </div>
        </div>
      </main>
    </div>
  );
}
