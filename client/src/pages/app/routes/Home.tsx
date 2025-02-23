import { PostSkeletonCard } from "@/components/PostSkeleton";
import { HomePostCard } from "../components/posts/HomePostCard";
import { useGetNewPosts } from "../hooks/usePostsHandler";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Home = () => {
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isPending,
    posts,
  } = useGetNewPosts(8, "id");

  const { ref, inView } = useInView({
    threshold: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isPending && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    return () => {
      window.scrollTo(0, 0);
    };
  }, []);

  return (
    <>
      <main className="flex mx-auto px-4 py-8 flex-wrap gap-x-8 gap-y-8 justify-center">
        {posts?.map((post, index) => (
          <HomePostCard
            key={post.id}
            {...post}
            ref={index === posts.length - 1 ? ref : undefined}
          />
        ))}
        {(isLoading || isFetchingNextPage) && (
          <>
            <PostSkeletonCard />
            <PostSkeletonCard />
            <PostSkeletonCard />
            <PostSkeletonCard />
            <PostSkeletonCard />
            <PostSkeletonCard />
            <PostSkeletonCard />
          </>
        )}
      </main>

      {!hasNextPage && (
        <div className="text-center my-4">No more posts to load</div>
      )}
    </>
  );
};

export default Home;
