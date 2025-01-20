import { useFullApp } from "@/store/hooks/useFullApp";
import { HomePostCard } from "../components/posts/HomePostCard";
import { useGetNewPosts } from "../hooks/usePostsHandler";
import { useEffect, useState } from "react";

const Home = () => {
  const [pageNumber, setPageNumber] = useState(1);

  const { isLoading } = useGetNewPosts(8, pageNumber);
  const { posts, stopFetchingPosts } = useFullApp();
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      setPageNumber((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (stopFetchingPosts) {
      window.removeEventListener("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [stopFetchingPosts]);

  return (
    <>
      <main className="flex mx-auto px-4 py-8 flex-wrap gap-x-8 gap-y-8 justify-center">
        {posts?.map((post) => (
          <HomePostCard key={post.id} {...post} />
        ))}
      </main>
      {isLoading && <div>Loading...</div>}
    </>
  );
};

export default Home;
