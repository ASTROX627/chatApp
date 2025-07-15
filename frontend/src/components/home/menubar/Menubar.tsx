import type { FC, JSX } from "react"
import { useAppContext } from "../../../context/app/appContext"
import SettingMenu from "./settings/SettingMenu";
import ConversationsMenu from "./conversation/ConversationsMenu";
import CreateGroupMenu from "./createGroup/CreateGroupMenu";

const Menubar: FC = (): JSX.Element => {
  const { showChatMenu, showSettingMenu, ShowCreateGroupMenu, showMessageContainer } = useAppContext();
  return (
    <div className={`h-full overflow-auto scrollbar scrollbar-track-neutral-700 scrollbar-thumb-neutral-900 hover:scrollbar-thumb-neutral-800 border-gray-500 rounded-lg
      ${showMessageContainer ? "w-0 lg:w-full" : "w-full"}
      lg:border-r lg:border-l lg:border-gray-500 lg:rounded-none`}>
      {showChatMenu && <ConversationsMenu />}
      {showSettingMenu && <SettingMenu />}
      {ShowCreateGroupMenu && <CreateGroupMenu />}
    </div>
  )
}

export default Menubar