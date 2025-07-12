import { MessageCircle } from "lucide-react"
import type { FC, JSX } from "react";
import { useAppContext } from "../../../context/app/appContext";
import { useTheme } from "../../../hooks/useTheme";

const Chat‌MenuButton: FC = (): JSX.Element => {
  const { setShowChatMenu, isActiveChatButton } = useAppContext();
  const {classes} = useTheme();
  return (
    <div
      onClick={setShowChatMenu}
      className={`p-3 cursor-pointer ${classes.primary.hover.bg} transition-all duration-200 border-b-1 border-gray-500 ${isActiveChatButton? classes.primary.bg: ""}`}>
      <MessageCircle size={30} />
    </div>
  )
}

export default Chat‌MenuButton;
