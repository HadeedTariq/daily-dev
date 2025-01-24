import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Readme", path: "" },
  { name: "Posts", path: "posts" },
  { name: "Squads", path: "squads" },
  { name: "Notifications", path: "notifications" },
  // { name: "Replies", path: "replies" },
  // { name: "Upvotes", path: "upvotes" },
];

export function ProfileHeader() {
  const { pathname } = useLocation();

  return (
    <nav>
      <ul className="flex space-x-4">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname ===
                `/profile${item.path === "" ? "" : `/${item.path}`}`
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
