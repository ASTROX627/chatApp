import { Megaphone, Users } from "lucide-react"
import type { FC, JSX } from "react"
import { useTranslation } from "react-i18next"
import CreateGroupFrom from "./CreateGroupFrom"



const CreateGroupMenu: FC = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="p-5">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold">{t("home.newGroup")}</h2>
        <Users size={20} />
        <span>/</span>
        <Megaphone size={20} />
      </div>
      <CreateGroupFrom />
    </div>
  )
}

export default CreateGroupMenu
