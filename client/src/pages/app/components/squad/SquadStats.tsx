import { Calendar, Eye, MessageSquare, ThumbsUp } from "lucide-react";

export function SquadStats({ squad }: { squad: SquadDetails }) {
  const totalPosts = squad.squad_posts_metadata?.length || 0;
  const totalUpvotes = squad.squad_posts_metadata?.reduce(
    (sum, post) => sum + post.post_upvotes,
    0
  );
  const totalViews = squad.squad_posts_metadata?.reduce(
    (sum, post) => sum + post.post_views,
    0
  );

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg border border-slate-700/50 p-6 hover:shadow-slate-700/10 transition-all duration-300">
      <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
        Squad Stats
        <span className="h-1 w-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full ml-2"></span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-indigo-500/10 text-indigo-400">
              <MessageSquare size={18} />
            </div>
            <p className="text-slate-400 font-medium">Total Posts</p>
          </div>
          <p className="text-2xl font-bold text-white">{totalPosts}</p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-purple-500/10 text-purple-400">
              <ThumbsUp size={18} />
            </div>
            <p className="text-slate-400 font-medium">Total Upvotes</p>
          </div>
          <p className="text-2xl font-bold text-white">{totalUpvotes || 0}</p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-blue-500/10 text-blue-400">
              <Eye size={18} />
            </div>
            <p className="text-slate-400 font-medium">Total Views</p>
          </div>
          <p className="text-2xl font-bold text-white">{totalViews || 0}</p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400">
              <Calendar size={18} />
            </div>
            <p className="text-slate-400 font-medium">Created At</p>
          </div>
          <p className="text-lg font-medium text-white">
            {new Date(squad.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
