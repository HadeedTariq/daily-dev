export function SquadStats({ squad }: { squad: SquadDetails }) {
  const totalPosts = squad.squad_posts.length;
  const totalUpvotes = squad.squad_posts.reduce(
    (sum, post) => sum + post.post_upvotes,
    0
  );
  const totalViews = squad.squad_posts.reduce(
    (sum, post) => sum + post.post_views,
    0
  );

  return (
    <div className="bg-slate-900 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Squad Stats</h2>
      <div className="space-y-4">
        <div>
          <p className="text-gray-600">Total Posts</p>
          <p className="text-2xl font-bold">{totalPosts}</p>
        </div>
        <div>
          <p className="text-gray-600">Total Upvotes</p>
          <p className="text-2xl font-bold">{totalUpvotes}</p>
        </div>
        <div>
          <p className="text-gray-600">Total Views</p>
          <p className="text-2xl font-bold">{totalViews}</p>
        </div>
        <div>
          <p className="text-gray-600">Created At</p>
          <p className="text-lg">
            {new Date(squad.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
