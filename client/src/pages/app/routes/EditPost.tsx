import LoadingBar from "@/components/LoadingBar";
import { useGetMyPostDetails } from "@/store/hooks/useFullApp";
import { useParams, useNavigate } from "react-router-dom";
import { EditPostForm } from "../components/posts/EditPostForm";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Ensuring values parsing is handled safely to catch potential NaN injections
  const postId = Number(id);
  const isInvalidId = !id || isNaN(postId);

  const { data, isLoading, isError, error } = useGetMyPostDetails(postId);

  if (isLoading) return <LoadingBar />;

  // Modern Error Boundary Rendering Block
  if (isError || isInvalidId || !data) {
    const errorMessage = isInvalidId
      ? "The provided post identifier is missing or corrupted."
      : (error as any)?.response?.data?.message ||
        "We encountered an unexpected error while retrieving your post details.";

    return (
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 animate-in fade-in duration-300">
        <Alert
          variant="destructive"
          className="border-destructive/30 bg-destructive/[0.02] dark:bg-destructive/[0.02] rounded-2xl p-5 flex flex-col sm:flex-row items-start gap-4"
        >
          <div className="p-2 rounded-xl bg-destructive/10 text-destructive shrink-0 mx-auto sm:mx-0">
            <AlertCircle className="h-5 w-5" />
          </div>

          <div className="space-y-3 flex-1 text-center sm:text-left">
            <AlertTitle className="text-base font-bold tracking-tight text-destructive">
              Unable to Load Post Editor
            </AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground leading-relaxed">
              {errorMessage}
            </AlertDescription>

            {/* Action Group for Error Resolution */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 justify-center sm:justify-start">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto h-9 px-4 rounded-xl border-border/80 text-muted-foreground hover:text-foreground gap-2 transition-all"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry Connection
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto h-9 px-4 rounded-xl text-muted-foreground hover:text-foreground gap-2 transition-all"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Go Back
              </Button>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-400">
      <EditPostForm post={data} />
    </div>
  );
};

export default EditPost;
