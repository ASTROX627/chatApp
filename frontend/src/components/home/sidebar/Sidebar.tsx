import Logout from "./Logout"
import { type FC, type JSX } from "react"
import Chat‌MenuButton from "./Chat‌MenuButton"
import SettingMenuButton from "./SettingMenuButton"

const Sidebar:FC = ():JSX.Element => {
  return (
    <div className="flex flex-col justify-between h-full border-e-1 border-gray-500">
      <div className="flex flex-col">
        <Chat‌MenuButton/>
        <SettingMenuButton/>
      </div>
      <Logout />
    </div>
  )
}

export default Sidebar
