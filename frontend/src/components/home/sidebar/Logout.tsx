import toast from "react-hot-toast";
import { httpService } from "../../../core/httpService"
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { LogOut } from "lucide-react";
import type { FC, JSX } from "react";
import { useAuthContext } from "../../../context/auth/authContext";
import { useTheme } from "../../../hooks/useTheme";
import { useTranslation } from "react-i18next";


const Logout: FC = (): JSX.Element => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();
  const { classes } = useTheme();
  const { t } = useTranslation();

  const handleLogout = async () => {
    const logoutPromise = httpService.post("/auth/logout");
    toast.promise(
      logoutPromise, {
      loading: t("auth.logoutLoading"),
      success: (response) => {
        if (response.status === 200) {
          setAuthUser(null);
          localStorage.removeItem("chat-user");
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 3000);
          return t("auth.logoutSuccessful");
        }
        return t("auth.networkError")

      },
      error: (error) => {
        if (error instanceof AxiosError && error.response) {
          const errorMessage = error.response.data?.error;
          if (errorMessage) {
            return errorMessage
          }
        }
        return t("auth.networkError")
      }
    }
    )
  }
  return (
    <div className="p-3 border-t-1 border-gray-500">
      <LogOut
        size={30}
        onClick={handleLogout}
        className={`${classes.primary.hover.text} cursor-pointer transition-all duration-200`}
      />
    </div>
  )
}

export default Logout
