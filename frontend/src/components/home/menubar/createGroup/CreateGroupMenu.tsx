import { Megaphone, Menu, Users } from "lucide-react"
import type { FC, JSX } from "react"
import { useTranslation } from "react-i18next"
import CreateGroupFrom from "./CreateGroupFrom"
import { useAppContext } from "../../../../context/app/appContext"



const CreateGroupMenu: FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { setShowSidebar } = useAppContext();

  return (
    <>
      <button onClick={setShowSidebar} className="m-5">
        <Menu size={32} />
      </button>
      <div className="p-5">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">{t("home.newGroup")}</h2>
          <Users size={20} />
          <span>/</span>
          <Megaphone size={20} />
        </div>
        <CreateGroupFrom />
      </div>
    </>
  )
}

export default CreateGroupMenu
