import { type FC } from "react"
import AuthInputs from "../AuthInputs"
import { useTranslation } from "react-i18next"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTheme } from "../../../hooks/useTheme"
import SelectGender from "./SelectGender"
import { Link } from "react-router-dom"
import type { RegisterFormValue } from "../../../types/auth"
import useAuth from "../../../hooks/useAuth"
import { useAuthValidationRules } from "../../../validations/useAuthValidationRules";
import { twMerge } from "tailwind-merge"

const GENDERS = ["male", "female"] as const;

const RegisterForm: FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValue>();
  const { classes } = useTheme();
  const { t } = useTranslation();
  const { handleRegister } = useAuth();
  const validationRules = useAuthValidationRules(watch);

  const onSubmit: SubmitHandler<RegisterFormValue> = async (data) => {
    await handleRegister(data)
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mt-5 flex flex-col">

      {/* FULLNAME_INPUT */}
      <AuthInputs
        label={t("auth.fullName")}
        register={register("fullName", validationRules.fullName)}
        error={errors.fullName}
        type="text"
        placeholder={t("auth.fullNamePlaceholder")}
      />

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

      {/* CONFIRM_PASSWORD_INPUT */}
      <AuthInputs
        label={t("auth.confirmPassword")}
        register={register("confirmPassword", validationRules.confirmPassword)}
        error={errors.confirmPassword}
        type="password"
        placeholder={t("auth.confirmPasswordPlaceholder")}
        isPassword
      />

      {/* SELECT_GENDER_RADIO */}
      <SelectGender
        register={register("gender", validationRules.gender)}
        genders={GENDERS}
        error={errors.gender}
      />

      <div className="mb-4">
        <Link
          to={"/login"}
          className={twMerge("text-sm lg:text-base hover:underline transition-all duration-200 inline-block ml-1", classes.secondary.hover.text)}
        >{t("auth.haveAnAccount")}</Link>
      </div>

      <button type="submit" className={twMerge("btn btn-sm border-0 hover:bg-gray-400/0 hover:outline", classes.primary.bg, classes.primary.hover.text, classes.primary.hover.outline)}>{t("auth.register")}</button>
    </form>
  )
}

export default RegisterForm