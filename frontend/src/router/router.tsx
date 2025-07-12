import { createBrowserRouter } from "react-router-dom";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import Home from "../pages/home/Home";
import ProtectRoute from "./ProtectRoute";

const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    element: <ProtectRoute/>,
    children:[
      {
        path: "/",
        index: true,
        element: <Home/>
      }
    ]
  }
])

export default router;