import { useNavigate } from "react-router-dom"
import { httpService } from "../core/httpService";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";

export type RegisterFormValue = {
  fullName: string,
  username: string,
  password: string,
  confirmPassword: string,
  gender: "male" | "female"
}

export const useRegister = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const registeration = async (data: RegisterFormValue) => {
    const registerPromise = httpService.post("/auth/register", data);
    toast.promise(
      registerPromise,
      {
        loading: t("auth.registerLoading"),
        success: (response) => {
          if (response.status === 201) {
            setTimeout(() => {
              navigate("/login", { replace: true })
            }, 3000);
            return t("auth.registerSuccess")
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
  return { registeration }
}
