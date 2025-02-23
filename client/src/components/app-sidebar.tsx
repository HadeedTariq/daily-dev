import * as React from "react";
import { BookOpen, Users, Globe, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

// This is sample data.
const data = {
  user: {
    name: "hadeedtariq",
    avatar: "/avatars/hadeedtariq.jpg",
  },
  mainMenu: [
    { title: "My feed", icon: BookOpen, url: "/" },
    { title: "Following", icon: Users, url: "/followings" },
    { title: "Explore", icon: Globe, url: "/explore" },
  ],
  squads: [
    // { title: "daily.dev World", icon: GalleryVerticalEnd, url: "#" },
    // { title: "Dev Squad", icon: Users, url: "#" },
    // { title: "Engineering Leadership", icon: Command, url: "#" },
    // { title: "NextJS", icon: Frame, url: "#" },
    // { title: "Node.js developers", icon: SquareTerminal, url: "#" },
    // { title: "Open Source", icon: GitPullRequest, url: "#" },
    // { title: "roadmap.sh", icon: Map, url: "#" },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="top-16 h-[100] " {...props}>
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.mainMenu?.map((item: any) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link to={item.url}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Squads</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.squads?.map((squad: any) => (
                <SidebarMenuItem key={squad.title}>
                  <SidebarMenuButton asChild>
                    <Link to={squad.url}>
                      <squad.icon className="mr-2 h-4 w-4" />
                      <span>{squad.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
