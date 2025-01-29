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
    <main className="flex mx-auto px-4 py-8 flex-wrap gap-x-8 gap-y-8 justify-center">
      {posts?.map((post) => (
        <ProfilePostCard key={post.id} loginUser={false} {...post} />
      ))}
    </main>
  );
}
