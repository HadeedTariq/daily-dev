import { postApi } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { HomePostCard } from "../components/posts/HomePostCard";

const Home = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["getPosts"],
    queryFn: async () => {
      const { data } = await postApi.get("/");
      return data.posts as PostCards[];
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  if (isLoading) return <h1>Loading...</h1>;
  return (
    <main className="flex mx-auto px-4 py-8 flex-wrap gap-x-4 gap-y-6 justify-center">
      {posts?.map((post) => (
        <HomePostCard {...post} />
      ))}
    </main>
  );
};

export default Home;
