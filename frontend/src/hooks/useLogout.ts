import toast from "react-hot-toast";
import { httpService } from "../core/httpService";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../context/auth/authContext";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

export const useLogout = () => {
  const { t } = useTranslation();
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();
  const logingOut = async () => {
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

  return { logingOut }
}