import type { FC, JSX } from "react"
import { useAppContext } from "../../../context/app/appContext"
import SettingMenu from "./settings/SettingMenu";
import ConversationsMenu from "./conversation/ConversationsMenu";

const Menubar: FC = (): JSX.Element => {
  const { showChatMenu, showSettingMenu } = useAppContext();
  return (
    <div className="h-full border-e-1 border-gray-500 w-[20vw]">
      {
        showChatMenu && (
          <ConversationsMenu />
        )
      }
      {
        showSettingMenu && (
          <SettingMenu />
        )
      }
    </div>
  )
}

export default Menubar