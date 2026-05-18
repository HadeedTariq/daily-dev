import { Link, useLocation } from "react-router-dom";
import { BookOpen, FileText, Users, Bell } from "lucide-react";

const navItems = [
  { name: "Readme", path: "", icon: BookOpen },
  { name: "Posts", path: "posts", icon: FileText },
  { name: "Squads", path: "squads", icon: Users },
  { name: "Notifications", path: "notifications", icon: Bell },
];

export function ProfileHeader() {
  const { pathname } = useLocation();

  return (
    <nav className="w-full border-b bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-2">
        {/* Horizontal scroll support for small viewports with scrollbar hidden */}
        <ul className="flex items-center space-x-1 overflow-x-auto scrollbar-none snap-x h-12">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === `/profile${item.path === "" ? "" : `/${item.path}`}`;

            return (
              <li
                key={item.path}
                className="snap-item shrink-0 relative h-full flex items-center"
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 px-4 h-full text-sm font-medium transition-all relative group select-none ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-transform duration-200 group-hover:scale-105 ${
                      isActive
                        ? "text-indigo-500"
                        : "text-muted-foreground/70 group-hover:text-foreground"
                    }`}
                  />

                  <span>{item.name}</span>

                  {/* Active Slide Underline Indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 dark:bg-indigo-400 rounded-t-full shadow-[0_-2px_10px_rgba(99,102,241,0.2)]" />
                  )}

                  {/* Hover Indicator Background for depth */}
                  <div className="absolute inset-x-1 inset-y-1.5 rounded-md bg-indigo-500/[0.04] dark:bg-indigo-400/[0.03] opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
