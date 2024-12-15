import { Route, Routes } from "react-router-dom";
import Register from "./pages/auth/routes/Register";
import Login from "./pages/auth/routes/Login";

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<HomeBar />}>
      <Route index element={<HomePage />} />
      <Route path="startExercise" element={<StartExercise />} />
      <Route path="exerciseSchedule" element={<ExerciseSchedule />} />
      <Route path="dietSchedule" element={<DietSchedule />} />
      <Route path="dashboard">
        <Route index element={<MyProfile />} />
        <Route path="createPost" element={<CreatePost />} />
        <Route path="allMyPosts" element={<AllMyPosts />} />
        <Route path="weeklyProgress" element={<WeeklyProgress />} />
        <Route path="monthlyProgress" element={<MonthlyProgress />} />
        <Route path="totalProgress" element={<TotalProgress />} />
      </Route>
    </Route> */}
      <Route path="/auth">
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
