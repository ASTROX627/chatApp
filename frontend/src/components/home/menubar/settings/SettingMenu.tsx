import { type FC, } from "react"
import { useAppContext } from "../../../../context/app/appContext"
import ChangeTheme from "./theme/ChangeTheme";
import ChangeLanguage from "./language/ChangeLanguage";
import { Menu } from "lucide-react";

const SettingMenu: FC = () => {
  const { showSettingMenu, setShowSidebar } = useAppContext();

  return (
    showSettingMenu && (
      <div className="h-full overflow-auto scrollbar scrollbar-track-neutral-700 scrollbar-thumb-neutral-900 hover:scrollbar-thumb-neutral-800">
        <button
          onClick={setShowSidebar}
          className="m-5 lg:hidden" 
        >
          <Menu size={32} />
        </button>
        <ChangeTheme />
        <ChangeLanguage />
      </div>
    )
  )
}

export default SettingMenu