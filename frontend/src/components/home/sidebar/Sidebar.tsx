import Logout from "./Logout"
import { type FC, type JSX } from "react"
import ConversationMenuButton from "./ConversationMenuButton"
import SettingMenuButton from "./SettingMenuButton"
import CreateGroupMenuButton from "./CreateGroupMenuButton"

const Sidebar:FC = ():JSX.Element => {
  return (
    <div className="flex flex-col justify-between h-full border-e-1 border-gray-500">
      <div className="flex flex-col">
        <ConversationMenuButton/>
        <SettingMenuButton/>
        <CreateGroupMenuButton/>
      </div>
      <Logout />
    </div>
  )
}

export default Sidebar
