import { LogOut } from "lucide-react";
import type { FC, JSX } from "react";
import { useTheme } from "../../../hooks/useTheme";
import { useLogout } from "../../../hooks/useLogout";
import { useTranslation } from "react-i18next";

const Logout: FC = (): JSX.Element => {
  const { classes } = useTheme();
  const { logingOut } = useLogout();
  const {t} = useTranslation();

  return (
    <button
      onClick={logingOut}
      className={`p-3 border-gray-500 flex items-center justify-start gap-2 ${classes.primary.hover.text} cursor-pointer transition-all duration-200 whitespace-nowrap`}>
      <div className="w-[30px] h-[30px] flex-shrink-0 flex items-center justify-center">
        <LogOut size={30} />
      </div>
      <h2>{t("home.logout")}</h2>
    </button>
  )
}

export default Logout
