import { format } from "date-fns";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { UserPost } from "../../routes/MyPosts";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { postApi } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

export const ProfilePostCard = ({
  title,
  thumbnail,
  created_at,
  squad_details,
  slug,
  id,
  loginUser = true,
}: UserPost & {
  loginUser?: boolean;
}) => {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deletePost, isPending } = useMutation({
    mutationKey: [`delete_post_${id}`],
    mutationFn: async () => {
      const { data } = await postApi.delete(`/delete-post/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["getMyPosts"] as InvalidateQueryFilters);
    },
    onError: (err: any) => {
      toast({
        title: err.response.data.message || "Failed to delete a comment.",
      });
    },
  });
  return (
    <Card className="w-[400px] h-[500px]" key={id}>
      {loginUser && (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit post</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => deletePost()} disabled={isPending}>
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete post</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <CardHeader className="relative p-0">
        <img
          src={thumbnail}
          alt={title}
          width={400}
          height={200}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center space-x-2 mb-2">
          <img
            src={squad_details.squad_thumbnail}
            alt={squad_details.squad_handle}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm text-muted-foreground">
            @{squad_details.squad_handle}
          </span>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">
            {format(new Date(created_at), "MMM d, yyyy")}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <Link to={`/posts/${slug}`}>
          <Button variant="secondary">Read Post</Button>
        </Link>
      </CardContent>
    </Card>
  );
};
