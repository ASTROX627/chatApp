import { LogOut } from "lucide-react";
import type { FC, JSX } from "react";
import { useTheme } from "../../../hooks/useTheme";
import { useTranslation } from "react-i18next";
import useAuth from "../../../hooks/useAuth";

const Logout: FC = (): JSX.Element => {
  const { classes } = useTheme();
  const { handleLogout } = useAuth();
  const { t } = useTranslation();

  return (
    <button
      onClick={handleLogout}
      className={`p-3 border-gray-500 ${classes.primary.hover.text} cursor-pointer transition-all duration-200 whitespace-nowrap
        flex items-center justify-start gap-2
        lg:justify-center lg:flex-col lg:gap-1 lg:text-xs`}
    >
      <div className="w-[30px] h-[30px] flex-shrink-0 flex items-center justify-center">
        <LogOut size={30} className="lg:size-20" />
      </div>
      <h2 className="lg:hidden">{t("home.logout")}</h2>
    </button>
  )
}

export default Logout
