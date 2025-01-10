import { HomePostCard } from "../components/posts/HomePostCard";
import { useGetPosts } from "../hooks/usePostsHandler";

const Home = () => {
  const { data: posts, isLoading } = useGetPosts();
  if (isLoading) return <h1>Loading...</h1>;
  return (
    <main className="flex mx-auto px-4 py-8 flex-wrap gap-x-4 gap-y-6 justify-center">
      {posts?.map((post) => (
        <HomePostCard key={post.id} {...post} />
      ))}
    </main>
  );
};

export default Home;
