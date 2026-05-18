import { useState } from "react";

import { Book, Edit3, Plus, Sparkles, Loader2 } from "lucide-react";
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
import ReadingStreak from "../components/ReadingStreak";

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
      setIsDialogOpen(false); // Smooth UX closure
    },
  });

  const hasReadme = !!profile?.about.readme;

  return (
    <div className="w-full space-y-6">
      {/* Dynamic Action & Utility Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/60 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Book className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Developer Bio Document
            </h3>
            <p className="text-xs text-muted-foreground">
              {hasReadme
                ? "Keep your developer profile markdown up to date."
                : "Personalize your space with a custom markdown section."}
            </p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant={hasReadme ? "outline" : "default"}
              size="sm"
              className={`h-9 px-4 rounded-xl font-medium shadow-sm transition-all select-none ${
                hasReadme
                  ? "border-border/80 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/[0.02]"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500"
              }`}
            >
              {hasReadme ? (
                <>
                  <Edit3 className="mr-2 h-4 w-4 stroke-[2]" />
                  Edit README
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4 stroke-[2.5]" />
                  Add README
                </>
              )}
            </Button>
          </DialogTrigger>

          {/* Fully maximized responsive modal interface */}
          <DialogContent className="w-[95vw] sm:max-w-3xl lg:max-w-4xl p-0 overflow-hidden border-border/80 rounded-2xl bg-background shadow-2xl">
            <div className="p-6 border-b border-border/50 bg-muted/20 flex flex-col gap-1">
              <DialogHeader className="p-0">
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                  {hasReadme ? "Edit Profile README" : "Build Profile README"}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground pt-0.5">
                  Markdown configuration renders directly to your public
                  developer portfolio page.
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Markdown Viewport Area */}
            <div className="w-full p-4 bg-background dark:bg-zinc-950 prose-editor-custom">
              <MarkdownEditor
                value={markdown}
                height="400px"
                width="100%"
                onChange={(value) => setMarkdown(value)}
                className="rounded-xl border border-border/80 overflow-hidden"
              />
            </div>

            {/* Control Bar */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-border/50 bg-muted/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl px-4 text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => updateProfile()}
                disabled={isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-md font-medium px-4 rounded-xl min-w-[120px]"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Book className="mr-2 h-4 w-4" />
                    Save README
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Render Workspace Containers */}
      {hasReadme && (
        <div className="p-5 border border-border/50 rounded-xl bg-card/20 shadow-sm">
          <ReadmeRendrer readme={profile?.about.readme} />
        </div>
      )}

      <div className="w-full">
        <ReadingStreak profile={profile} />
      </div>
    </div>
  );
}
