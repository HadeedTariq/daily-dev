import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { squadApi } from "@/lib/axios";

import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { Navigate, useParams } from "react-router-dom";

import { squadCategories } from "@/utils/data";
import axios from "axios";

export const squadSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or less"),
  squad_handle: z
    .string()
    .min(1, "Squad handle is required")
    .max(255, "Squad handle must be 255 characters or less"),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .optional(),
  category: z.string(),
  thumbnail: z.string(),
  is_public: z.boolean(),
  post_creation_allowed_to: z.string(),
  invitation_permission: z.string(),
  post_approval_required: z.boolean(),
});

export type SquadFormData = z.infer<typeof squadSchema>;

export default function SquadEditPage() {
  const { squad_handle } = useParams();
  const [file, setFile] = useState<File | string>("");

  const form = useForm<SquadFormData>({
    resolver: zodResolver(squadSchema),
  });
  const {
    data: squad,
    isLoading,
    isPending: isSquadPending,
  } = useQuery({
    queryKey: [`squad-${squad_handle}`],
    queryFn: async () => {
      const { data } = await squadApi.get(`/details/${squad_handle}`);
      delete data.squad_posts;
      Object.keys(data).forEach((key) => {
        if (key === "squad_name") {
          form.setValue("name", data[key]);
          return;
        }
        form.setValue(key as any, data[key]);
      });

      return data as SquadDetails;
    },
  });

  const { isPending, mutate } = useMutation({
    mutationKey: [`update_squad-${squad_handle}`],
    mutationFn: async (formData: SquadFormData) => {
      const cloudinaryForm = new FormData();
      cloudinaryForm.append("file", file);
      cloudinaryForm.append("upload_preset", "n5y4fqsf");
      cloudinaryForm.append("cloud_name", "lmsproject");
      try {
        const { data: cloudinaryData } = await axios.post(
          "https://api.cloudinary.com/v1_1/lmsproject/image/upload",
          cloudinaryForm
        );
        formData.thumbnail = cloudinaryData.secure_url;
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
      const { data } = await squadApi.put(`/edit/${squad_handle}`, formData);
      return data;
    },
    onSuccess: (data: any) => {
      toast({
        title: data.message || "Squad updated successfully",
        description: "Your changes have been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: error.response.data.message || "Error updating squad",
        description:
          "There was a problem saving your changes. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        form.setValue("thumbnail", e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: SquadFormData) => {
    // data.thumbnail = thumbnailPreview;

    mutate(data);
  };
  if (isLoading || isSquadPending) return <h1>Loading...</h1>;
  if (!squad) return <Navigate to={"/"} />;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Squad</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="squad_handle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Squad Handle</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Thumbnail</FormLabel>
            <FormControl>
              <Input
                type="file"
                onChange={handleThumbnailChange}
                accept="image/*"
              />
            </FormControl>
            {form.getValues("thumbnail") && (
              <img
                src={String(form.watch("thumbnail"))}
                alt="Squad thumbnail"
                className="mt-2 w-32 h-32 object-cover"
              />
            )}
          </FormItem>

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {squadCategories.map((category) => (
                      <SelectItem value={category} key={category}>
                        {category.split("-").join(" ").toUpperCase()}
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
            name="is_public"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Public Squad</FormLabel>
                  <FormDescription>
                    Make this squad visible to everyone
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="post_creation_allowed_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post Creation Allowed To</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select who can create posts" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="members">Members</SelectItem>
                    <SelectItem value="admins">Admins</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="invitation_permission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invitation Permission</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select who can invite" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="members">Members</SelectItem>
                    <SelectItem value="admins">Admins</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="post_approval_required"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Post Approval Required
                  </FormLabel>
                  <FormDescription>
                    Require approval for new posts
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update Squad"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
