import toast from "react-hot-toast";
import { httpService } from "../../core/httpService"
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = async() => {
    const logoutPromise = httpService.post("/logout");
    toast.promise(
      logoutPromise,{
        loading: ("Singing out from your account..."),
        success: (response) => {
          if(response.status === 200){
            setTimeout(() => {
              navigate("/login", {replace: true});
            }, 3000);
            return "Singing out successful! Redirecting to login page...";
          }
          return "Singing out was successfull"
        },
        error: (error) => {
          if(error instanceof AxiosError && error.response){
            if(error.response.status === 500){
              return error.response.data?.error;
            }
          }
        }
      }
    )
  }
  return (
    <div>
      <button className="cursor-pointer" onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Logout
