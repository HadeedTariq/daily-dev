import { PostCard } from "./PostCard";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useGetNewSquadPosts } from "../../hooks/usePostsHandler";

export function PostList({ squadId }: { squadId: number }) {
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isPending,
    posts,
  } = useGetNewSquadPosts(8, squadId);

  const { ref, inView } = useInView({
    threshold: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isPending && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <div className="space-y-6">
        {posts.map((post, index) => (
          <PostCard
            key={post.post_id}
            {...post}
            ref={index === posts.length - 1 ? ref : undefined}
          />
        ))}
      </div>
      {isLoading && <h1>Loading...</h1>}
    </>
  );
}
