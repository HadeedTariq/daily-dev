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

import { useMutation } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { postApi } from "@/lib/axios";
import MarkdownEditor from "@uiw/react-markdown-editor";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useGetJoinedSquads } from "../hooks/useGetJoinedSquads";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  squad: z.string(),
  thumbnail: z.string().optional(),
});

export function CreatePost() {
  const { data: joinedSquads } = useGetJoinedSquads();

  const [thumbnail, setThumbnail] = useState<string>("");
  const [file, setFile] = useState<string | File>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      squad: "",
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
    if (file) {
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
    }

    if (!values.thumbnail) {
      toast({
        title: "Error",
        description: "Please upload a thumbnail",
        variant: "destructive",
      });
      return;
    }

    createPost(values);
  }

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

        <Button
          type="submit"
          disabled={isPostPending || form.formState.isSubmitting}
        >
          Create Post
        </Button>
      </form>
    </Form>
  );
}
