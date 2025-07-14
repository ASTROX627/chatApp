import { Pencil } from "lucide-react"
import type { FC, JSX } from "react"
import { useTheme } from "../../../hooks/useTheme"
import { useAppContext } from "../../../context/app/appContext"
import { useTranslation } from "react-i18next"

const CreateGroupMenuButton: FC = (): JSX.Element => {
  const { setShowCreateGroupMenu, isActiveCreateGroupButton } = useAppContext();
  const { classes } = useTheme();
  const {t} = useTranslation();
  return (
    <div
      onClick={setShowCreateGroupMenu}
      className={`p-3 cursor-pointer ${classes.primary.hover.bg} ${isActiveCreateGroupButton ? classes.primary.bg : ""} flex items-center justify-start gap-2 whitespace-nowrap`}>
      <div className="w-[30px] h-[30px] flex-shrink-0 flex items-center justify-center">
        <Pencil size={30} />
      </div>
      <h2>{t("home.createGroup")}</h2>
    </div>
  )
}

export default CreateGroupMenuButton