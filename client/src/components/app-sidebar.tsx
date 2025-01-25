import * as React from "react";
import {
  BookOpen,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SquareTerminal,
  Bookmark,
  Clock,
  Network,
  Search,
  Users,
  Globe,
  PlusCircle,
  Cloud,
  Lightbulb,
  Database,
  Code,
  MessageSquare,
  FileText,
  GitPullRequest,
} from "lucide-react";

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
    { title: "Explore", icon: Globe, url: "#" },
    { title: "Bookmarks", icon: Bookmark, url: "#" },
    { title: "History", icon: Clock, url: "#" },
    { title: "Network", icon: Network, url: "#" },
    { title: "Find Squads", icon: Search, url: "#" },
  ],
  squads: [
    { title: "daily.dev World", icon: GalleryVerticalEnd, url: "#" },
    { title: "Dev Squad", icon: Users, url: "#" },
    { title: "Engineering Leadership", icon: Command, url: "#" },
    { title: "NextJS", icon: Frame, url: "#" },
    { title: "Node.js developers", icon: SquareTerminal, url: "#" },
    { title: "Open Source", icon: GitPullRequest, url: "#" },
    { title: "roadmap.sh", icon: Map, url: "#" },
  ],
  customFeeds: [
    { title: "Cloud", icon: Cloud, url: "#" },
    { title: "Tips", icon: Lightbulb, url: "#" },
    { title: "MERN", icon: Database, url: "#" },
    { title: "Backend", icon: SquareTerminal, url: "#" },
    { title: "Database", icon: Database, url: "#" },
    { title: "Dsa", icon: Code, url: "#" },
  ],
  discover: [
    { title: "Tags", icon: Bookmark, url: "#" },
    { title: "Sources", icon: Globe, url: "#" },
    { title: "Leaderboard", icon: PieChart, url: "#" },
    { title: "Discussions", icon: MessageSquare, url: "#" },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="top-16" {...props}>
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.mainMenu.map((item) => (
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
              {data.squads.map((squad) => (
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

        <SidebarGroup>
          <SidebarGroupLabel>Custom feeds</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.customFeeds.map((feed) => (
                <SidebarMenuItem key={feed.title}>
                  <SidebarMenuButton asChild>
                    <Link to={feed.url}>
                      <feed.icon className="mr-2 h-4 w-4" />
                      <span>{feed.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Discover</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.discover.map((item) => (
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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="#">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Submit a link</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="#">
                <FileText className="mr-2 h-4 w-4" />
                <span>Resources</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
