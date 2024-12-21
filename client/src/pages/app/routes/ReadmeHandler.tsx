import { useState } from "react";

import { Book, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import MarkdownEditor from "@uiw/react-markdown-editor";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useFullApp } from "@/store/hooks/useFullApp";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { profileApi } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import ReadmeRendrer from "../components/ReadmeRendrer";

export function ReadmeHandler() {
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { profile } = useFullApp();
  const [markdown, setMarkdown] = useState(profile?.about.readme);

  const { mutate: updateProfile, isPending } = useMutation({
    mutationKey: ["readmeHandler"],
    mutationFn: async () => {
      const { data } = await profileApi.post("/readme-handler", {
        readme: markdown,
      });
      return data;
    },
    onError: (err: any) => {
      toast({
        title: err.response.data.message || "Something went wrong",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      toast({
        title: data.message || "Readme Saved Successfully",
      });
      queryClient.invalidateQueries([
        "getProfile",
        0,
      ] as InvalidateQueryFilters);
    },
  });

  return (
    <div className="w-full">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          {profile?.about.readme ? (
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Edit README
            </Button>
          ) : (
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add README
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="w-[425px]">
          <DialogHeader>
            {profile?.about.readme ? (
              <DialogTitle>Edit README</DialogTitle>
            ) : (
              <DialogTitle>Add README</DialogTitle>
            )}
            <DialogDescription>
              Create a README for your profile. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="  w-full">
            <MarkdownEditor
              value={markdown}
              height="300px"
              width="370px"
              onChange={(value) => setMarkdown(value)}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => updateProfile()} disabled={isPending}>
              <Book className="mr-2 h-4 w-4" />
              Save README
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ReadmeRendrer />
    </div>
  );
}
