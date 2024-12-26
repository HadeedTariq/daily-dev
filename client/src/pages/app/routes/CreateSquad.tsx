import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { squadApi } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { squadCategories } from "@/utils/data";

const formSchema = z.object({
  name: z
    .string()
    .min(6, "Name must be at least 6  characters")
    .max(255, "Name must be less than 255 characters"),
  squad_handle: z
    .string()
    .min(6, "Squad handle must be at least 6 characters")
    .max(255, "Squad handle must be less than 255 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  category: z.enum([
    "frontend",
    "backend",
    "full-stack",
    "devops",
    "data-science",
    "AI",
    "mobile",
    "cloud",
    "security",
    "quality-assurance",
    "general",
  ]),
  is_public: z.boolean().default(true),
  post_creation_allowed_to: z.enum(["members", "moderators"]),
  invitation_permission: z.enum(["members", "moderators"]),
  post_approval_required: z.boolean().default(false),
});

export default function SquadCreationForm() {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      squad_handle: "",
      description: "",
      category: "general",
      is_public: true,
      post_creation_allowed_to: "members",
      invitation_permission: "members",
      post_approval_required: false,
    },
  });

  const { mutate: createSquad, isPending: isPending } = useMutation({
    mutationKey: ["createSquad"],
    mutationFn: async (newSquad: z.infer<typeof formSchema>) => {
      const { data } = await squadApi.post("/create", { ...newSquad });
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
      toast({
        title: data.message || "Squad created successfully",
      });
      queryClient.invalidateQueries(["getMySquads"] as InvalidateQueryFilters);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createSquad(values);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Squad</CardTitle>
        <CardDescription>
          Fill out the form below to create your squad.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Squad Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter squad name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your squad's display name.
                  </FormDescription>
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
                    <Input placeholder="Enter squad handle" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your squad's unique identifier.
                  </FormDescription>
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
                    <Textarea placeholder="Describe your squad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {squadCategories.map((category) => (
                        <SelectItem value={category}>
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
                      <SelectItem value="moderators">Moderators</SelectItem>
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
                        <SelectValue placeholder="Select who can invite others" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="members">Members</SelectItem>
                      <SelectItem value="moderators">Moderators</SelectItem>
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
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating..." : "Create Squad"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
