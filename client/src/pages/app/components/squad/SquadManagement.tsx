import * as React from "react";
import {
  EllipsisVertical,
  Users,
  Settings,
  DeleteIcon,
  LogOutIcon,
  LeafyGreen,
  JoystickIcon,
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
    (member) => member.userDetails.userId === user?.id
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
        title: data.message || "Successfully leaved the squad",
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
        title: data.message || "Successfully delete the squad",
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
        <Button variant="outline" size="icon">
          <EllipsisVertical className="h-4 w-4" />
          <span className="sr-only">Open squad settings menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0">
        <Command>
          <CommandList>
            {user?.id === adminId ? (
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    navigate("edit");
                  }}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Squad
                </CommandItem>
                <CommandItem
                  disabled={isDeletingPending}
                  onSelect={() => {
                    deleteSquad();
                  }}
                >
                  <DeleteIcon className="mr-2 h-4 w-4" />
                  Delete Squad
                </CommandItem>
              </CommandGroup>
            ) : (
              <CommandGroup>
                {isUserMemberOfSquad ? (
                  <CommandItem
                    disabled={isLeavingPending}
                    onSelect={() => leaveSquad()}
                  >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Leave Squad
                  </CommandItem>
                ) : (
                  <CommandItem
                    disabled={isJoinPending}
                    onSelect={() => joinSquad()}
                  >
                    <JoystickIcon className="mr-2 h-4 w-4" />
                    Join Squad
                  </CommandItem>
                )}
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                  }}
                >
                  <LeafyGreen className="mr-2 h-4 w-4" />
                  Learn More
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
