import { useState, type FC, type JSX } from "react"
import AuthInputs from "../AuthInputs"
import { useTranslation } from "react-i18next"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useRegister, type RegisterFormValue } from "../../../hooks/useRegister"
import { useTheme } from "../../../hooks/useTheme"
import SelectGender from "./SelectGender"
import { Link } from "react-router-dom"


const RegisterForm: FC = (): JSX.Element => {
  const { register, watch, handleSubmit, formState: { errors } } = useForm<RegisterFormValue>()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShoConfirmPassword] = useState(false);
  const genders = ["male", "female"];
  const { classes } = useTheme();
  const { t } = useTranslation();
  const { registeration } = useRegister();

  const onSubmit: SubmitHandler<RegisterFormValue> = async (data) => {
    await registeration(data)
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mt-5 flex flex-col">

      {/* FULLNAME_INPUT */}
      <AuthInputs
        label={t("auth.fullName")}
        register={register("fullName", {
          required: t("auth.fullNameRequired"),
          minLength: {
            value: 3,
            message: t("auth.fullNameMinLength")
          }
        })}
        error={errors.fullName}
        type="text"
        placeholder={t("auth.fullNamePlaceholder")}
      />

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

      {/* CONFIRM_PASSWORD_INPUT */}
      <AuthInputs
        label={t("auth.confirmPassword")}
        register={register("confirmPassword", {
          required: t("auth.confirmPasswordRequired"),
          validate: (value) => {
            if (watch("password") !== value) {
              return t("auth.passwordsDoNotMatch")
            }
          }
        })}
        error={errors.confirmPassword}
        type="password"
        placeholder={t("auth.confirmPasswordPlaceholder")}
        isPassword
        showPassword={showConfirmPassword}
        toggleShowPassword={() => setShoConfirmPassword(!showConfirmPassword)}
      />

      {/* SELECT_GENDER_RADIO */}
      <SelectGender
        register={register("gender", {
          required: t("auth.selectGender")
        })}
        genders={genders}
        error={errors.gender}
      />

      <div className="mb-4">
        <Link
          to={"/login"}
          className={`text-sm hover:underline ${classes.secondary.hover.text} transition-all duration-200 inline-block ml-1`}
        >{t("auth.haveAnAccount")}</Link>
      </div>

      <button type="submit" className={`btn btn-sm border-0 ${classes.primary.bg} hover:bg-gray-400/0 ${classes.primary.hover.text} hover:outline ${classes.primary.hover.outline}`}>{t("auth.register")}</button>
    </form>
  )
}

export default RegisterForm