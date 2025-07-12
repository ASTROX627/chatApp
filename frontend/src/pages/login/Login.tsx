import { useState, type FC, type JSX } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import AuthInputs from "../../components/auth/AuthInputs"
import { httpService } from "../../core/httpService"
import toast from "react-hot-toast"
import { AxiosError } from "axios"
import { useAuthContext } from "../../context/auth/authContext"
import { useTheme } from "../../hooks/useTheme"
import { useTranslation } from "react-i18next"

type LoginFormValue = {
  username: string,
  password: string
}

const Login: FC = (): JSX.Element => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValue>();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { classes } = useTheme();
  const { setAuthUser } = useAuthContext();
  const { t } = useTranslation();

  const onSubmit: SubmitHandler<LoginFormValue> = async (data) => {
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

  return (
    <div className="bg-gray-400/10 backdrop-blur-lg p-6 flex flex-col min-w-96 items-center justify-center rounded-lg shadow-lg">
      <h1 className="text-white text-3xl font-semibold mb-5">{t("auth.login")} <span className={`${classes.primary.text}`}>{t("auth.chatApp")}</span></h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mt-5 flex flex-col">

        {/* USERNAME_INPUT */}
        <AuthInputs
          label={t("auth.username")}
          register={register("username", {
            required: t("auth.usernameRequired"),
            minLength: {
              value: 3,
              message: t("auth.usernameMinLength")
            }
          })}
          error={errors.username}
          type="text"
          placeholder={t("auth.usernamePlaceholder")}
        />

        {/* PASSWORD_INPUT */}
        <AuthInputs
          label={t("auth.password")}
          register={register("password", {
            required: t("auth.passwordRequired"),
            minLength: {
              value: 6,
              message: t("auth.passwordMinLength")
            }
          })}
          error={errors.password}
          type="password"
          placeholder={t("auth.passwordPlaceholder")}
          isPassword
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
        />

        <div className="mb-4">
          <Link
            to={"/register"}
            className={`text-sm hover:underline ${classes.secondary.hover.text} transition-all duration-200 inline-block ml-1`}
          >{t("auth.donHanvAnAccount")}</Link>
        </div>

        <button type="submit" className={`btn btn-sm border-0 ${classes.primary.bg} hover:bg-gray-400/0 ${classes.primary.hover.text} hover:outline ${classes.primary.hover.outline}`}>{t("auth.login")}</button>
      </form>
    </div>
  )
}

export default Login