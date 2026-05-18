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

import { PenSquare, SendHorizontal, Loader2 } from "lucide-react";

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
          formData,
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
    event: React.ChangeEvent<HTMLInputElement>,
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 bg-card/40 border border-border/60 rounded-2xl backdrop-blur-sm shadow-sm"
      >
        {/* Form Heading Context */}
        <div className="space-y-1 pb-4 border-b border-border/60">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <PenSquare className="h-5 w-5 text-indigo-500" />
            Create a New Post
          </h2>
          <p className="text-xs text-muted-foreground">
            Share your engineering insights, updates, or articles with your tech
            community squads.
          </p>
        </div>

        {/* Post Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                Post Title
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Mastering Clean Code Architecture in React"
                  className="h-10 rounded-xl border-border/80 bg-background/50 focus-visible:ring-indigo-500"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-[11px] text-muted-foreground/80">
                Keep your headline concise, highly engaging, and relevant to the
                audience.
              </FormDescription>
              <FormMessage className="text-xs font-medium text-destructive" />
            </FormItem>
          )}
        />

        {/* Responsive Metadata Grid (Thumbnail & Squad Selector Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Thumbnail Upload Presentation */}
          <FormField
            control={form.control}
            name="thumbnail"
            render={() => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                  Cover Thumbnail
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 rounded-xl border border-border/80 bg-background/30 w-full">
                    <Avatar className="h-20 w-20 rounded-xl border border-border/60 shadow-inner shrink-0">
                      <AvatarImage
                        src={thumbnail || "/placeholder.svg"}
                        alt="Thumbnail preview"
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs rounded-xl font-medium">
                        Preview
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1.5 w-full">
                      <div className="relative flex items-center">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                          className="cursor-pointer file:bg-indigo-500/10 file:text-indigo-600 dark:file:text-indigo-400 file:border-none file:rounded-md file:text-xs file:font-semibold hover:file:bg-indigo-500/20 h-9 rounded-xl border-border/80 bg-background w-full text-xs text-muted-foreground focus-visible:ring-indigo-500"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground/70">
                        Recommended size: 1200×630px (PNG or JPEG).
                      </p>
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-medium text-destructive" />
              </FormItem>
            )}
          />

          {/* Target Community Squad Selector */}
          <FormField
            control={form.control}
            name="squad"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                  Target Squad Destination
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full h-20 rounded-xl border-border/80 bg-background/50 focus:ring-indigo-500 text-left px-4">
                      <SelectValue placeholder="Select an active community squad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-border/80 max-h-60">
                    {joinedSquads?.map((squad) => (
                      <SelectItem
                        key={squad.squad_id}
                        value={squad.squad_id.toString()}
                        className="cursor-pointer rounded-lg text-sm"
                      >
                        <span className="font-medium text-foreground">
                          {squad.squad_name}
                        </span>{" "}
                        <span className="text-xs text-muted-foreground/70">
                          @{squad.squad_handle}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs font-medium text-destructive" />
              </FormItem>
            )}
          />
        </div>

        {/* Post Main Content Markdown Textarea Editor */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                Article Content Body
              </FormLabel>
              <FormControl>
                <div className="w-full border border-border/80 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 custom-md-editor">
                  <MarkdownEditor height="320px" width="100%" {...field} />
                </div>
              </FormControl>
              <FormMessage className="text-xs font-medium text-destructive" />
            </FormItem>
          )}
        />

        {/* Control Submission Trigger Section */}
        <div className="flex items-center justify-end pt-4 border-t border-border/60">
          <Button
            type="submit"
            disabled={isPostPending || form.formState.isSubmitting}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium py-5 px-6 rounded-xl shadow-md shadow-indigo-500/10 transition-all select-none min-w-[150px]"
          >
            {isPostPending || form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <SendHorizontal className="mr-2 h-4 w-4 stroke-[2]" />
                Publish Post
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
