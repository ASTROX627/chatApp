import { type FC, type JSX } from "react"
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";
import LoginFrom from "../../components/auth/login/LoginFrom";



const Login: FC = (): JSX.Element => {
  const { classes } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="bg-gray-400/10 backdrop-blur-lg p-6 flex flex-col min-w-96 items-center justify-center rounded-lg shadow-lg">
      <h1 className="text-white text-3xl font-semibold mb-5">{t("auth.login")} <span className={`${classes.primary.text}`}>{t("auth.chatApp")}</span></h1>
        <LoginFrom/>
    </div>
  )
}

export default Login