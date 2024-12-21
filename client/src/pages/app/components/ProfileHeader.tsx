import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Readme", path: "/profile" },
  { name: "Explore", path: "/explore" },
  { name: "Bookmarks", path: "/bookmarks" },
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
                pathname === item.path
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
