import { Link, useLocation, useParams } from "react-router-dom";

const navItems = [
  { name: "Readme", path: "" },
  { name: "Posts", path: "posts" },
];

export function UserProfileHeader() {
  const { pathname } = useLocation();
  const { username } = useParams();

  return (
    <nav>
      <ul className="flex space-x-4">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname ===
                `/user-profile/${username}${
                  item.path === "" ? "" : `/${item.path}`
                }`
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
