import { type FC } from "react"
import { useAppContext } from "../../../../context/app/appContext"
import ChangeTheme from "./theme/ChangeTheme";
import ChangeLanguage from "./language/ChangeLanguage";




const SettingMenu: FC = () => {
  const { showSettingMenu} = useAppContext();

  return (
    showSettingMenu && (
      <>
        <ChangeTheme/>
        <ChangeLanguage/>
      </>
    )
  )
}

export default SettingMenu