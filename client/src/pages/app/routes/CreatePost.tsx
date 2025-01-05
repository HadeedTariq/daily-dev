import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { postApi, profileApi } from "@/lib/axios";
import MarkdownEditor from "@uiw/react-markdown-editor";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useGetTags } from "../hooks/useGetTags";

export interface JoinedSquad {
  squad_id: number;
  squad_name: string;
  squad_handle: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  squad: z.string(),
  thumbnail: z.string().optional(),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
});

export function CreatePost() {
  const queryClient = useQueryClient();
  const { data: joinedSquads, isLoading: isSquadsLoading } = useQuery({
    queryKey: ["getUserSquads"],
    queryFn: async () => {
      const { data } = await profileApi.get("/get-my-joined-squads");
      return data.squads as JoinedSquad[];
    },
  });

  const [thumbnail, setThumbnail] = useState<string>("");
  const [file, setFile] = useState<string | File>("");
  const { isLoading, data: tags } = useGetTags();
  const [newTag, setNewTag] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      squad: "",
      tags: [],
    },
  });

  const { mutate: createPost, isPending: isPostPending } = useMutation({
    mutationKey: ["createPost"],
    mutationFn: async (newPost: any) => {
      const { data } = await postApi.post("/create", { ...newPost });
      return data;
    },
    onError: (err: any) => {
      toast({
        title: err.response.data.message || "Something went wrong",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      form.reset();
      setThumbnail("");
      toast({
        title: data.message || "Post created successfully",
      });
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "n5y4fqsf");
    formData.append("cloud_name", "lmsproject");
    try {
      const { data: cloudinaryData } = await axios.post(
        "https://api.cloudinary.com/v1_1/lmsproject/image/upload",
        formData
      );
      values.thumbnail = cloudinaryData.secure_url;
    } catch (err) {
      console.log(err);
      toast({
        title: "Error uploading",
        description: "Failed to upload the file. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    const postTags = values.tags?.map((tag) => {
      const tagData = tags?.find((t) => t.name === tag);
      return { id: tagData?.id, name: tag };
    });
    values.tags = postTags as any;
    createPost(values);
  }
  const { mutate: handleAddTag, isPending: isTagPending } = useMutation({
    mutationKey: ["createTag"],
    mutationFn: async () => {
      const { data } = await postApi.post("/create-tag", { name: newTag });
      return data;
    },
    onError: (err: any) => {
      toast({
        title: err.response.data.message || "Something went wrong",
        variant: "destructive",
      });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries(["getTags"] as InvalidateQueryFilters);
      toast({
        title: data.message || "Tag created successfully",
      });
    },
  });

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter post title" {...field} />
              </FormControl>
              <FormDescription>
                The title of your post. Keep it concise and catchy.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="thumbnail"
          render={() => (
            <FormItem>
              <FormLabel>Thumbnail</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={thumbnail || "/placeholder.svg"}
                      alt="Thumbnail"
                    />
                    <AvatarFallback>Thumbnail</AvatarFallback>
                  </Avatar>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="w-auto"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"squad"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Squad</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select a squad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {joinedSquads?.map((squad) => (
                    <SelectItem
                      key={squad.squad_id}
                      value={squad.squad_id.toString()}
                    >
                      {squad.squad_name} (@{squad.squad_handle})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <div className="w-full">
                  <MarkdownEditor height="300px" width="100%" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <Select
                onValueChange={(value) => {
                  if (field.value.length > 2) {
                    toast({
                      title: "Maximum 3 tags allowed",
                      description: "You can only select a maximum of 3 tags.",
                      variant: "destructive",
                      duration: 2000,
                    });
                    return;
                  }
                  if (!field.value.includes(value)) {
                    field.onChange([...field.value, value]);
                  }
                }}
                value={field.value[field.value.length - 1] || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tags" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tags?.map((tag) => (
                    <SelectItem key={tag.id} value={tag.name}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select existing tags or create a new one below.
              </FormDescription>
              <FormMessage />
              <div className="flex items-center mt-2">
                <Input
                  placeholder="New tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="mr-2"
                />
                <Button
                  type="button"
                  onClick={() => handleAddTag()}
                  disabled={isTagPending}
                >
                  Add Tag
                </Button>
              </div>
              {field.value.length > 0 && (
                <div className="mt-2">
                  <p>Selected tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((tag) => (
                      <div
                        key={tag}
                        className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPostPending}>
          Create Post
        </Button>
      </form>
    </Form>
  );
}
