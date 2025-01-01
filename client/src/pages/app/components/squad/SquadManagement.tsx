import * as React from "react";
import {
  EllipsisVertical,
  Users,
  Settings,
  LogOut,
  DeleteIcon,
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

const squadUserSettings = [
  {
    value: "squad-wokring",
    label: "Learn How Squad Works",
    icon: Users,
    href: "/squad/working",
  },
  {
    value: "leave",
    label: "Leave Squad",
    icon: LogOut,
    href: "/squad/leave",
  },
];

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
};
export default function SquadSettingsMenu({ adminId }: SquadSettingsMenuProps) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user } = useFullApp();
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
                {squadUserSettings.map((item) => (
                  <CommandItem
                    key={item.value}
                    onSelect={() => {
                      setOpen(false);
                      console.log(`Navigating to ${item.href}`);
                    }}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
