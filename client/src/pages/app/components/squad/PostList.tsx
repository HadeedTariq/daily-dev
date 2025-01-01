import { PostCard } from "./PostCard";

export function PostList({ posts }: { posts: SquadPost[] }) {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.post_id} post={post} />
      ))}
    </div>
  );
}
