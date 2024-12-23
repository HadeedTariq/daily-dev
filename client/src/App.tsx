import { Route, Routes } from "react-router-dom";
import Register from "./pages/auth/routes/Register";
import Login from "./pages/auth/routes/Login";
import LoadingBar from "./components/LoadingBar";
import { useFullApp } from "./store/hooks/useFullApp";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { authApi, profileApi } from "./lib/axios";
import { setUser } from "./reducers/fullAppReducer";
import { useEffect } from "react";
import AuthProtector from "./pages/auth/components/AuthProtector";
import NavBar from "./pages/app/components/Nabar";
import Profile from "./pages/app/routes/Profile";
import EditProfile from "./pages/app/routes/EditProfile";
import { ReadmeHandler } from "./pages/app/routes/ReadmeHandler";
import MyPosts from "./pages/app/routes/MyPosts";
import MyReplies from "./pages/app/routes/MyReplies";
import MyUpvotes from "./pages/app/routes/MyUpVotes";
import { CreatePost } from "./pages/app/routes/CreatePost";
import Home from "./pages/app/routes/Home";
import CreateSquad from "./pages/app/routes/CreateSquad";
import SquadsHandler from "./pages/app/routes/MySquads";

function App() {
  const { user } = useFullApp();
  const dispatch = useDispatch();
  const { mutate: updateUserStreak } = useMutation({
    mutationKey: ["updateUserStreak"],
    mutationFn: async () => {
      const { data } = await profileApi.put("/update-streak");
      return data;
    },
  });
  const { isPending, mutate: authUser } = useMutation({
    mutationKey: ["authenticateUser"],
    mutationFn: async () => {
      const { data } = await authApi.get("/");
      dispatch(setUser(data));
    },
    onError: async () => {
      const { status } = await authApi.post("/refreshAccessToken");
      if (status < 400) {
        const { data } = await authApi.get("/");
        dispatch(setUser(data));
        updateUserStreak();
      }
    },
    onSuccess: () => {
      updateUserStreak();
    },
  });

  useEffect(() => {
    if (!user) {
      authUser();
    }
  }, [user]);

  if (isPending) return <LoadingBar />;
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />}>
          <Route index element={<ReadmeHandler />} />
          <Route path="posts" element={<MyPosts />} />
          <Route path="replies" element={<MyReplies />} />
          <Route path="upvotes" element={<MyUpvotes />} />
          <Route path="squads">
            <Route index element={<SquadsHandler />} />
          </Route>
        </Route>
        <Route path="post/create" element={<CreatePost />} />
        <Route path="squads/create" element={<CreateSquad />} />

        <Route path="editProfile" element={<EditProfile />} />
      </Route>
      <Route path="/auth" element={<AuthProtector />}>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
