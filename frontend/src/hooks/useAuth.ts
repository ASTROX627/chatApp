import axios from "axios";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/app/appContext";
import { useAuthContext } from "../context/auth/authContext";
import { httpService } from "../core/httpService";
import type { AuthRequestData, AuthResponse, LoginFromValue, RegisterFormValue } from "../types/auth";



type AuthEndpoint = "/auth/register" | "/auth/login" | "/auth/logout";

const useAuth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();
  const { resetState } = useAppContext();

  const handleAuthRequest = useCallback(
    async <T extends AuthRequestData>(
      url: AuthEndpoint,
      data: T,
      successMessage: string,
      redirectPath: string
    ): Promise<string> => {
      try {
        const response = await httpService.post<AuthResponse>(url, data);

        if (response.status === 200 || response.status === 201) {
          if (url === "/auth/login" && response.data.user) {
            resetState();
            setAuthUser(response.data.user);
            localStorage.setItem("chat-user", JSON.stringify(response.data.user));
          }

          setTimeout(() => navigate(redirectPath, { replace: true }), 3000);
          return t(successMessage);
        }
        return t("auth.networkError");
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(error.response.data?.error || t("auth.networkError"));
        }
        throw new Error(t("auth.networkError"));
      }
    },
    [navigate, resetState, setAuthUser, t]
  );

  const handleRegister = useCallback(
    async (data: RegisterFormValue): Promise<void> => {
      toast.promise(
        handleAuthRequest(
          "/auth/register",
          data,
          "auth.registerSuccess",
          "/login"
        ),
        {
          loading: t("auth.registerLoading"),
          success: (message: string) => message,
          error: (error: Error) => error.message,
        }
      );
    },
    [handleAuthRequest, t]
  );

  const handleLogin = useCallback(
    async (data: LoginFromValue): Promise<void> => {
      toast.promise(
        handleAuthRequest(
          "/auth/login",
          data,
          "auth.loginSuccess",
          "/"
        ),
        {
          loading: t("auth.loginLoading"),
          success: (message: string) => message,
          error: (error: Error) => error.message,
        }
      );
    },
    [handleAuthRequest, t]
  );

  const handleLogout = useCallback(
    async (): Promise<void> => {
      toast.promise(
        handleAuthRequest(
          "/auth/logout",
          null,
          "auth.logoutSuccessful",
          "/login"
        ),
        {
          loading: t("auth.logoutLoading"),
          success: (message: string) => message,
          error: (erorr: Error) => erorr.message
        }
      )
    }, [handleAuthRequest, t])

  return { handleRegister, handleLogin, handleLogout };
};

export default useAuth;