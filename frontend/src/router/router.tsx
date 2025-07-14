import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home";
import ProtectRoute from "./ProtectRoute";
import RegisterPage from "../pages/register/RegisterPage";
import LoginPage from "../pages/login/LoginPage";

const router = createBrowserRouter([
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    element: <ProtectRoute />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />
      }
    ]
  }
])

export default router;