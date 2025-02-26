import { Navigate, Outlet } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import { authApi } from "@/lib/axios";
import LoadingBar from "@/components/LoadingBar";

const AuthProtector = () => {
  const { isPending, data: user } = useQuery({
    queryKey: ["authenticateUser"],
    queryFn: async () => {
      const { data } = await authApi.get("/");
      return data;
    },
    refetchOnMount: false,
  });
  if (isPending) return <LoadingBar />;
  if (user) return <Navigate to={"/"} />;
  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthProtector;
