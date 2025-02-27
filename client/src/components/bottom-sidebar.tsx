import { Link, useLocation } from "react-router-dom";
import { BookOpen, Users, Globe, User } from "lucide-react";

const menuItems = [
  { title: "My feed", icon: BookOpen, url: "/" },
  { title: "Following", icon: Users, url: "/followings" },
  { title: "Explore", icon: Globe, url: "/explore" },
  { title: "Profile", icon: User, url: "/profile" },
];

export function BottomNavBar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-4 py-2 md:hidden">
      <ul className="flex justify-around items-center">
        {menuItems.map((item) => (
          <li key={item.title}>
            <Link
              to={item.url}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200 ${
                location.pathname === item.url
                  ? "text-indigo-400 bg-slate-800"
                  : "text-slate-400 hover:bg-slate-800/50"
              }`}
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span className="text-xs">{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
