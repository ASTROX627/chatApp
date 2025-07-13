import { Settings } from "lucide-react"
import type { FC, JSX } from "react";
import { useAppContext } from "../../../context/app/appContext";
import { useTheme } from "../../../hooks/useTheme";

const SettingMenuButton: FC = (): JSX.Element => {
  const { setShowSettingMenu, isActiveSettingButton } = useAppContext();
  const {classes,} = useTheme();
  return (
    <div
      onClick={setShowSettingMenu}
      className={`p-3 cursor-pointer ${classes.primary.hover.bg} transition-all duration-200 border-b-1 border-gray-500 ${isActiveSettingButton? classes.primary.bg: ""}`}>
      <Settings size={30} />
    </div>
  )
}

export default SettingMenuButton;