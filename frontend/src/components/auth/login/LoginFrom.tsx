import { useForm, type SubmitHandler } from "react-hook-form";
import { useLogin, type LoginFormValue } from "../../../hooks/useLogin";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useTheme } from "../../../hooks/useTheme";
import AuthInputs from "../AuthInputs";

const LoginFrom = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValue>();
  const [showPassword, setShowPassword] = useState(false);
  const { classes } = useTheme();
  const { t } = useTranslation();
  const { loginIn } = useLogin();

  const onSubmit: SubmitHandler<LoginFormValue> = async (data) => {
    await loginIn(data);
  }
  return (
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
          className={`text-sm lg:text-base hover:underline ${classes.secondary.hover.text} transition-all duration-200 inline-block ml-1`}
        >{t("auth.donHanvAnAccount")}</Link>
      </div>

      <button type="submit" className={`btn btn-sm border-0 ${classes.primary.bg} hover:bg-gray-400/0 ${classes.primary.hover.text} hover:outline ${classes.primary.hover.outline}`}>{t("auth.login")}</button>
    </form>
  )
}

export default LoginFrom;