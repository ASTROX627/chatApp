import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/login/Login";
import Home from "../pages/home/Home";
import ProtectRoute from "./ProtectRoute";
import RegisterPage from "../pages/register/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/login",
    element: <Login />
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