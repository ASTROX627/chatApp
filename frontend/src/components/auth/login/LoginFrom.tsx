import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useTheme } from "../../../hooks/useTheme";
import AuthInputs from "../AuthInputs";
import useAuth from "../../../hooks/useAuth";
import type { LoginFormValue } from "../../../types/auth";
import { useAuthValidationRules } from "../../../validations/useAuthValidationRules";
import { twMerge } from "tailwind-merge";

const LoginFrom = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValue>();
  const { classes } = useTheme();
  const { t } = useTranslation();
  const { handleLogin } = useAuth();
  const validationRules = useAuthValidationRules();

  const onSubmit: SubmitHandler<LoginFormValue> = async (data) => {
    await handleLogin(data);
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mt-5 flex flex-col">

      {/* USERNAME_INPUT */}
      <AuthInputs
        label={t("auth.username")}
        register={register("username", validationRules.username)}
        error={errors.username}
        type="text"
        placeholder={t("auth.usernamePlaceholder")}
      />

      {/* PASSWORD_INPUT */}
      <AuthInputs
        label={t("auth.password")}
        register={register("password", validationRules.password)}
        error={errors.password}
        type="password"
        placeholder={t("auth.passwordPlaceholder")}
        isPassword
      />

      <div className="mb-4">
        <Link
          to={"/register"}
          className={twMerge("text-sm lg:text-base hover:underline transition-all duration-200 inline-block ml-1", classes.secondary.hover.text)}
        >{t("auth.donHanvAnAccount")}</Link>
      </div>

      <button type="submit" className={twMerge("btn btn-sm border-0 hover:bg-gray-400/0 hover:outline", classes.primary.bg, classes.primary.hover.text, classes.primary.hover.outline)}>{t("auth.login")}</button>
    </form>
  )
}

export default LoginFrom;