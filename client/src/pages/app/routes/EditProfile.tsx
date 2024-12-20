import { useFullApp } from "@/store/hooks/useFullApp";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { profileApi } from "@/lib/axios";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  avatar: z.string(),
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(50, {
      message: "Name must not be longer than 50 characters.",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  profession: z.string().optional(),
  bio: z.string().max(160).optional(),
  company: z.string().optional(),
  job_title: z.string().optional(),
  github: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  x: z.string().url().optional().or(z.literal("")),
  youtube: z.string().url().optional().or(z.literal("")),
  stack_overflow: z.string().url().optional().or(z.literal("")),
  reddit: z.string().url().optional().or(z.literal("")),
  roadmap_sh: z.string().url().optional().or(z.literal("")),
  codepen: z.string().url().optional().or(z.literal("")),
  mastodon: z.string().url().optional().or(z.literal("")),
  threads: z.string().url().optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const EditProfile = () => {
  const queryClient = useQueryClient();
  const { profile } = useFullApp();
  const [avatar, setAvatar] = useState<string | undefined>(profile?.avatar);
  const [file, setFile] = useState<string | File>("");
  const { mutate: updateProfile, isPending } = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: async (formData: ProfileFormValues) => {
      const { data } = await profileApi.put("/edit", { ...formData });
      return data;
    },
    onError: (err: any) => {
      toast({
        title: err.response.data.message || "Something went wrong",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      console.log(data);

      toast({
        title: data.message || "Profile Updated successfully",
      });
      queryClient.invalidateQueries([
        "getProfile",
        0,
      ] as InvalidateQueryFilters);
    },
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ...profile,
      ...profile?.social_links,
      ...profile?.user_stats,
      ...profile?.about,
    },
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
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
        data.avatar = cloudinaryData.secure_url;
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
    updateProfile(data);
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!profile) return <Navigate to={"/profile"} />;
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="avatar"
            render={() => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={avatar || "/placeholder.svg"}
                        alt="Profile picture"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="w-auto"
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Choose a profile picture. It will be displayed as a circle.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name. It can be your real name or
                  a pseudonym.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>
                  This is your full name. It will be displayed on your profile.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  Your email address. This won't be displayed publicly.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profession</FormLabel>
                <FormControl>
                  <Input placeholder="Software Developer" {...field} />
                </FormControl>
                <FormDescription>
                  Your current profession or role.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can @mention other users and organizations to link to
                  them.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormDescription>Where you currently work.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="job_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="Senior Developer" {...field} />
                </FormControl>
                <FormDescription>
                  Your current position at your company.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://github.com/yourusername"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Your GitHub profile URL.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://www.linkedin.com/in/yourusername"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Your LinkedIn profile URL.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://www.yourwebsite.com" {...field} />
                </FormControl>
                <FormDescription>Your personal website URL.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="x"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter</FormLabel>
                <FormControl>
                  <Input placeholder="https://x.com/yourusername" {...field} />
                </FormControl>
                <FormDescription>Your Twitter profile URL.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="youtube"
            render={({ field }) => (
              <FormItem>
                <FormLabel>YouTube</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://www.youtube.com/c/yourchannel"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Your YouTube channel URL.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stack_overflow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stack Overflow</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://stackoverflow.com/users/youruserid"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Your Stack Overflow profile URL.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reddit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reddit</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://www.reddit.com/user/yourusername"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Your Reddit profile URL.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roadmap_sh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roadmap.sh</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://roadmap.sh/yourusername"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Your Roadmap.sh profile URL.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="codepen"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CodePen</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://codepen.io/yourusername"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Your CodePen profile URL.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mastodon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mastodon</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://mastodon.social/@yourusername"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Your Mastodon profile URL.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="threads"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Threads</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://www.threads.net/@yourusername"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Your Threads profile URL.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditProfile;
