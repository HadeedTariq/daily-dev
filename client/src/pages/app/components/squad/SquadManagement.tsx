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

const squadAdminSettings = [
  {
    value: "squad-wokring",
    label: "Learn How Squad Works",
    icon: Users,
    href: "/squad/working",
  },
  {
    value: "settings",
    label: "Squad Settings",
    icon: Settings,
    href: "edit",
  },
  {
    value: "delete",
    label: "Delete Squad",
    icon: DeleteIcon,
    href: "/squad/delete",
  },
];

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

  const { mutate: joinSquad, isPending: isJoinPending } = useMutation({
    mutationKey: [`joinSquad_${squad.squad_handle}`],
    mutationFn: async () => {
      const { data } = await squadApi.post("/join", {
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
                {squadAdminSettings.map((item) => (
                  <CommandItem
                    key={item.value}
                    onSelect={() => {
                      setOpen(false);
                      navigate(`${item.href}`);
                    }}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandGroup>
                {isUserMemberOfSquad ? (
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                    }}
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
