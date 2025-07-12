import { useEffect, type FC } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import  { useAuthContext } from "../context/auth/authContext";

const ProtectRoute:FC = () => {
  const navigate = useNavigate();

  const {authUser} = useAuthContext();

  useEffect(() => {
    if(!authUser){
      navigate("/login", {replace: true})
    }
  }, [authUser, navigate])

  return(
    authUser? <Outlet/> : null
  )
}

export default ProtectRoute