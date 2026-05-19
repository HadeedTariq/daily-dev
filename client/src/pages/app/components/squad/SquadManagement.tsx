import * as React from "react";
import {
  EllipsisVertical,
  Settings,
  Trash2,
  LogOut,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFullApp } from "@/store/hooks/useFullApp";
import { useNavigate } from "react-router-dom";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { squadApi } from "@/lib/axios";

type SquadSettingsMenuProps = {
  adminId: number;
  squad: SquadDetails;
};

export default function SquadSettingsMenu({
  adminId,
  squad,
}: SquadSettingsMenuProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user } = useFullApp();
  const isUserMemberOfSquad = squad.squad_members?.find(
    (member) => member.userDetails.userId === user?.id,
  );

  const { mutate: leaveSquad, isPending: isLeavingPending } = useMutation({
    mutationKey: [`leaveSquad_${squad.squad_handle}`],
    mutationFn: async () => {
      const { data } = await squadApi.put("/leave", {
        squad_id: squad.squad_id,
        squad_handle: squad.squad_handle,
      });
      return data;
    },
    onError: (err: any) => {
      toast({
        title: err.response.data.message || "Failed to leave the squad",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      toast({
        title: data.message || "Successfully left the squad",
      });
      queryClient.invalidateQueries([
        `squad-${squad.squad_handle}`,
      ] as InvalidateQueryFilters);
    },
  });

  const { mutate: deleteSquad, isPending: isDeletingPending } = useMutation({
    mutationKey: [`deleteSquad_${squad.squad_handle}`],
    mutationFn: async () => {
      const { data } = await squadApi.delete(`/${squad.squad_id}`);
      return data;
    },
    onError: (err: any) => {
      toast({
        title: err.response.data.message || "Failed to delete the squad",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      toast({
        title: data.message || "Successfully deleted the squad",
      });
      queryClient.invalidateQueries([
        `squad-${squad.squad_handle}`,
      ] as InvalidateQueryFilters);
      navigate("/profile/squads");
    },
  });

  const { mutate: joinSquad, isPending: isJoinPending } = useMutation({
    mutationKey: [`joinSquad_${squad.squad_handle}`],
    mutationFn: async () => {
      const { data } = await squadApi.put("/join", {
        squad_id: squad.squad_id,
        squad_handle: squad.squad_handle,
      });
      return data;
    },
    onError: (err: any) => {
      toast({
        title: err.response.data.message || "Failed to join the squad",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      toast({
        title: data.message || "Successfully joined the squad",
      });
      queryClient.invalidateQueries([
        `squad-${squad.squad_handle}`,
      ] as InvalidateQueryFilters);
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 hover:bg-indigo-50 dark:hover:bg-indigo-950 border-indigo-200 dark:border-indigo-800"
        >
          <EllipsisVertical className="h-4 w-4 text-indigo-600" />
          <span className="sr-only">Open squad settings menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-0 shadow-lg border border-indigo-200 dark:border-indigo-800"
        align="end"
      >
        <Command>
          <CommandList>
            {user?.id === adminId ? (
              <CommandGroup className="overflow-hidden">
                <CommandItem
                  onSelect={() => {
                    navigate("edit");
                    setOpen(false);
                  }}
                  className="gap-2 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950"
                >
                  <Settings className="h-4 w-4 text-indigo-600" />
                  <span>Manage Squad</span>
                </CommandItem>
                <CommandItem
                  disabled={isDeletingPending}
                  onSelect={() => {
                    deleteSquad();
                    setOpen(false);
                  }}
                  className="gap-2 cursor-pointer text-destructive hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>
                    {isDeletingPending ? "Deleting..." : "Delete Squad"}
                  </span>
                </CommandItem>
              </CommandGroup>
            ) : (
              <CommandGroup className="overflow-hidden">
                {isUserMemberOfSquad ? (
                  <CommandItem
                    disabled={isLeavingPending}
                    onSelect={() => {
                      leaveSquad();
                      setOpen(false);
                    }}
                    className="gap-2 cursor-pointer text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>
                      {isLeavingPending ? "Leaving..." : "Leave Squad"}
                    </span>
                  </CommandItem>
                ) : (
                  <CommandItem
                    disabled={isJoinPending}
                    onSelect={() => {
                      joinSquad();
                      setOpen(false);
                    }}
                    className="gap-2 cursor-pointer text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>{isJoinPending ? "Joining..." : "Join Squad"}</span>
                  </CommandItem>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
