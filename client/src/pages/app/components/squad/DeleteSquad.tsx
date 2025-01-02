import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { squadApi } from "@/lib/axios";
import { useNavigate } from "react-router-dom";

interface DeleteSquadProps {
  squad_handle: string;
  squadName: string;
}

export function DeleteSquad({ squad_handle, squadName }: DeleteSquadProps) {
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async function () {
      const { data } = await squadApi.delete(`/${squad_handle}`);
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["getMySquads"] });
      toast({
        title: data.message || "Squad deleted",
        description: `${squadName} has been successfully deleted.`,
      });
      setIsOpen(false);
      setTimeout(() => {
        navigate("/profile/squads");
      }, 1000);
    },
    onError: (error: any) => {
      toast({
        title: error.response.data.message || "Error deleting squad",
        description: `Failed to delete ${squadName}. Please try again.`,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="my-4">
      <Button variant="destructive" size="sm" onClick={() => setIsOpen(true)}>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Squad
      </Button>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="border-red-600">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              squad "{squadName}" and remove all the posts of the squad.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => mutation.mutate()}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
