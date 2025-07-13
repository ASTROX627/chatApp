import { type FC, type JSX } from "react"
import RegisterForm from "../../components/auth/register/RegisterForm"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme";

const RegisterPage: FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { classes } = useTheme();

  return (
    <div className="bg-gray-400/10 backdrop-blur-lg p-6 flex flex-col min-w-96 items-center justify-center rounded-lg shadow-lg">
      <h1 className="text-white text-3xl font-semibold mb-5">{t("auth.register")} <span className={`${classes.primary.text}`}>{t("auth.chatApp")}</span></h1>
      <RegisterForm />
    </div>
  )
}

export default RegisterPage;