import { postApi } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

import { ProfilePostCard } from "../../components/profile/ProfilePostCard";
import { useOutletContext } from "react-router-dom";

export type UserPost = {
  id: number;
  thumbnail: string;
  title: string;
  content: string;
  slug: string;
  created_at: string;
  squad_id: number;
  squad_details: PostSquadDetails;
};
export function UserPosts() {
  const { userId }: any = useOutletContext();
  const { data: posts, isLoading } = useQuery({
    queryKey: ["getMyPosts"],
    queryFn: async () => {
      const { data } = await postApi.get(`/get-user-posts?userId=${userId}`);
      return data.posts as UserPost[];
    },
  });
  if (isLoading) return <h1>Loading...</h1>;
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
        {posts?.map((post) => (
          <ProfilePostCard key={post.id} loginUser={false} {...post} />
        ))}
      </div>
    </main>
  );
}
