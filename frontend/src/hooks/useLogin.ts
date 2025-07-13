import toast from "react-hot-toast"
import { httpService } from "../core/httpService"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import { useAuthContext } from "../context/auth/authContext"

export type LoginFormValue = {
  username: string,
  password: string
}

export const useLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();
  const loginIn = async (data: LoginFormValue) => {
    const loginPromise = httpService.post("/auth/login", data);
    toast.promise(
      loginPromise,
      {
        loading: t("auth.loginLoading"),
        success: (response) => {
          if (response.status === 200) {
            setAuthUser(response.data.user)
            localStorage.setItem("chat-user", JSON.stringify(response.data.user))
            setTimeout(() => {
              navigate("/", { replace: true })
            }, 3000);
            return t("auth.loginSuccess")
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
    );
  }

  return { loginIn }
}