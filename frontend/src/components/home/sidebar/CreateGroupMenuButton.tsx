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
    <button
      onClick={setShowCreateGroupMenu}
      className={`p-3 cursor-pointer ${classes.primary.hover.bg} transition-all duration-200 border-b-1 border-gray-500 ${isActiveCreateGroupButton ? classes.primary.bg : ""} 
        flex items-center justify-start gap-2 whitespace-nowrap
        lg:justify-center lg:flex-col lg:gap-1 lg:text-xs`}
    >
      <div className="w-[30px] h-[30px] flex-shrink-0 flex items-center justify-center">
        <Pencil size={30} className="lg:size-20" />
      </div>
      <h2 className="lg:hidden">{t("home.chats")}</h2>
    </button>
  )
}

export default CreateGroupMenuButton