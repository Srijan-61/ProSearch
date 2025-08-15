import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./features/login/login";
import Register from "./features/register/register";
import Home from "./features/home/home";
import LoginGuard from "./shared/guards/loginGuard";
import AuthGuard from "./shared/guards/authGuard";
import Profile from "./features/profile/profile";
import { ToastContainer } from "react-toastify"; // import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // import Toastify CSS

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/login"
          element={
            <LoginGuard>
              <Login />
            </LoginGuard>
          }
        />
        <Route
          path="/register"
          element={
            <LoginGuard>
              <Register />
            </LoginGuard>
          }
        />
        <Route
          path="/home"
          element={
            <AuthGuard>
              <Home />
            </AuthGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard>
              <Profile />
            </AuthGuard>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <AuthGuard>
              <Profile />
            </AuthGuard>
          }
        />
      </Routes>

      <ToastContainer/>
    </>
  );
}

export default App;
