import { type FC } from "react"
import { useAppContext } from "../../../../context/app/appContext"
import ChangeTheme from "./theme/ChangeTheme";
import ChangeLanguage from "./language/ChangeLanguage";




const SettingMenu: FC = () => {
  const { showSettingMenu} = useAppContext();

  return (
    showSettingMenu && (
      <div className="h-full overflow-auto scrollbar scrollbar-track-neutral-700 scrollbar-thumb-neutral-900 hover:scrollbar-thumb-neutral-800">
        <ChangeTheme/>
        <ChangeLanguage/>
      </div>
    )
  )
}

export default SettingMenu