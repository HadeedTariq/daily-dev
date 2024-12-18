import { Link, Outlet, useNavigate } from "react-router-dom";

import { authApi } from "@/lib/axios";
import { useFullApp } from "@/store/hooks/useFullApp";
import { Button } from "@/components/ui/button";
import { NavDrawer } from "./NavDrawer";
import Authenticate from "./NonAuthorizer";

const NavBar = () => {
  const navigate = useNavigate();
  const { user } = useFullApp();

  const logout = async () => {
    await authApi.post("/logout");
    window.location.reload();
  };
  return (
    <div className="flex flex-col w-full z-50">
      <div className="relative h-[70px] ">
        <header className="fixed w-full h-[67px] border-b border-b-gray-400 dark:bg-slate-800 bg-gray-50 z-50">
          <div className="mx-auto flex h-16 max-w-screen-xl items-center px-4 ">
            <div className="flex flex-1 items-center justify-between">
              <h1
                className="font-bold text-[23px] max-[500px]:text-[19px] text-orange-500 font-roboto-mono cursor-pointer"
                onClick={() => navigate("/")}
              >
                Daily Dev
              </h1>
              <nav aria-label="Global" className="hidden md:block"></nav>

              <div className="flex items-center gap-4 max-[640px]:hidden">
                {user ? (
                  <>
                    <Button variant={"destructive"} onClick={logout}>
                      Logout
                    </Button>
                    <Link to={"/profile"}>
                      <Button variant={"link"}>Profile</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      className=" rounded-md bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition font-ubuntu hover:bg-orange-600"
                      to="/auth/login"
                    >
                      Login
                    </Link>

                    <Link
                      className=" rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-orange-600 font-ubuntu transition hover:text-orange-600/75"
                      to="/auth/register"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
              <div className="min-[640px]:hidden flex items-center gap-2 mx-6">
                <NavDrawer />
              </div>
            </div>
          </div>
        </header>
      </div>
      {user ? <Outlet /> : <Authenticate />}
    </div>
  );
};

export default NavBar;
