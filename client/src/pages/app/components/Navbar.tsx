import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  Compass,
  Users,
  FileText,
  MessageSquare,
  ThumbsUp,
  Bell,
  Shield,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { authApi } from "@/lib/axios";
import { useFullApp } from "@/store/hooks/useFullApp";
import { NavDrawer } from "./NavDrawer";
import Authenticate from "./NonAuthorizer";
import { AppSidebar } from "@/components/app-sidebar";
import { BottomNavBar } from "@/components/bottom-sidebar";

const profileLinks = [
  { to: "/profile", label: "Overview", icon: User },
  { to: "/profile/posts", label: "Posts", icon: FileText },
  { to: "/profile/replies", label: "Replies", icon: MessageSquare },
  { to: "/profile/upvotes", label: "Upvotes", icon: ThumbsUp },
  { to: "/profile/notifications", label: "Notifications", icon: Bell },
  { to: "/profile/squads", label: "Squads", icon: Shield },
];

const navLinks = [
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/followings", label: "Following", icon: Users },
];

const NavBar = () => {
  const navigate = useNavigate();
  const { user } = useFullApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const logout = async () => {
    await authApi.post("/logout");
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="flex flex-col w-full z-50">
        <div className="relative h-[70px]">
          <header className="fixed w-full h-[67px] z-50 bg-[#0d0f14] border-b border-white/[0.06]">
            {/* subtle top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />

            <div className="mx-auto flex h-full max-w-screen-xl items-center px-4 sm:px-6">
              <div className="flex flex-1 items-center justify-between gap-6">
                {/* Logo */}
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2.5 shrink-0 group"
                >
                  <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:bg-indigo-500 transition-colors duration-200">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M2 7h10M7 2l5 5-5 5"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="font-semibold text-[15px] tracking-tight text-white font-mono">
                    Daily Dev Clone
                  </span>
                </button>

                {/* Center nav links — logged-in only, desktop */}
                {user && (
                  <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map(({ to, label, icon: Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-150 font-medium"
                      >
                        <Icon size={14} strokeWidth={2} />
                        {label}
                      </Link>
                    ))}
                  </nav>
                )}

                {/* Right section */}
                <div className="flex items-center gap-3 max-[640px]:hidden">
                  {user ? (
                    <div className="flex items-center gap-2">
                      {/* Profile dropdown */}
                      <div className="relative" ref={dropdownRef}>
                        <button
                          onClick={() => setProfileOpen((p) => !p)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-150"
                        >
                          <User size={14} strokeWidth={2} />
                          <span>Profile</span>
                          <ChevronDown
                            size={12}
                            strokeWidth={2}
                            className={`transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        {profileOpen && (
                          <div className="absolute right-0 top-full mt-2 w-52 bg-[#13151c] border border-white/[0.08] rounded-lg shadow-2xl shadow-black/50 overflow-hidden z-50">
                            <div className="px-3 pt-3 pb-2">
                              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
                                Profile
                              </p>
                            </div>
                            <div className="pb-2">
                              {profileLinks.map(({ to, label, icon: Icon }) => (
                                <Link
                                  key={to}
                                  to={to}
                                  onClick={() => setProfileOpen(false)}
                                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors duration-150 mx-1 rounded-md"
                                >
                                  <Icon
                                    size={14}
                                    strokeWidth={2}
                                    className="text-slate-500"
                                  />
                                  {label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Logout */}
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] border border-red-500/20 hover:border-red-500/30 transition-all duration-150"
                      >
                        <LogOut size={14} strokeWidth={2} />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Link
                        to="/auth/login"
                        className="px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.14] rounded-md transition-all duration-150"
                      >
                        Login
                      </Link>
                      <Link
                        to="/auth/register"
                        className="px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md shadow-lg shadow-indigo-500/20 transition-all duration-150"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile hamburger */}
                <div className="min-[640px]:hidden flex items-center gap-2 mx-2">
                  <NavDrawer />
                </div>
              </div>
            </div>

            {/* Sidebar mounts (unchanged) */}
            <div className="w-fit">
              <AppSidebar />
              <BottomNavBar />
            </div>
          </header>
        </div>

        {user ? (
          <div className="ml-16 max-[770px]:ml-0 max-[770px]:mb-16">
            <Outlet />
          </div>
        ) : (
          <Authenticate />
        )}
      </div>
    </>
  );
};

export default NavBar;
