import { useTranslation } from "react-i18next"
import type { RegisterFormValue } from "../types/auth";

export const useAuthValidationRules = (watch?: (name: keyof RegisterFormValue) => string) => {
  const { t } = useTranslation();


  return {
    fullName: {
      required: t("auth.fullNameRequired"),
      minLength: {
        value: 3,
        message: t("auth.fullNameMinLength")
      }
    },
    username: {
      required: t("auth.usernameRequired"),
      minLength: {
        value: 3,
        message: t("auth.usernameMinLength")
      }
    },
    password: {
      required: t("auth.passwordRequired"),
      minLength: {
        value: 6,
        message: t("auth.passwordMinLength")
      }
    },
    confirmPassword: {
      required: t("auth.confirmPasswordRequired"),
      validate: watch ? (value: string) => {
        if (watch("password") !== value) {
          return t("auth.passwordsDoNotMatch");
        }
      } : undefined
    },
    gender: {
      required: t("auth.selectGender")
    }
  }
}