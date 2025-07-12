import type { FC, JSX } from "react"
import ThemeCard from "./ThemeCard"
import { useAppContext } from "../../../../../context/app/appContext";
import { Palette } from "lucide-react";
import { THEME_CONFIGS } from "../../../../../configs/theme/themConfig";
import { useTranslation } from "react-i18next";

const ChangeTheme: FC = (): JSX.Element => {
    const { changeTheme, theme } = useAppContext();
    const {t} = useTranslation()
  
  return (
    <>
      <div className="flex px-5 pt-4 items-center gap-2">
        <h2 className="text-lg font-semibold">{t("home.changeTheme")}</h2>
        <Palette size={22}/>
      </div>
      <div
        className="grid grid-cols-2 p-5 w-[20-vw] gap-2"
        role="radiogroup"
        aria-label="Theme selection"
      >
        {Object.values(THEME_CONFIGS).map((config) => (
          <ThemeCard
            key={config.name}
            config={config}
            isActive={theme === config.name}
            onSelect={changeTheme}
          />
        ))}

      </div>
    </>
  )
}

export default ChangeTheme