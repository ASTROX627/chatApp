import { Globe } from "lucide-react"
import SelectLanguage from "./SelectLanguage"
import { useTranslation } from "react-i18next"
import type { FC, JSX } from "react";

const ChangeLanguage:FC = ():JSX.Element => {
  const {t} = useTranslation();
  return (
    <div className="p-5">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">{t("home.changeLanguage")}</h2>
        <Globe size={22} />
      </div>
      <SelectLanguage />
    </div>
  )
}

export default ChangeLanguage
