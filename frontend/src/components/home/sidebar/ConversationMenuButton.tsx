import { MessageCircle } from "lucide-react"
import type { FC, JSX } from "react";
import { useAppContext } from "../../../context/app/appContext";
import { useTheme } from "../../../hooks/useTheme";
import { useTranslation } from "react-i18next";

const ConversationMenuButton: FC = (): JSX.Element => {
  const { setShowChatMenu, isActiveChatButton } = useAppContext();
  const { classes } = useTheme();
  const { t } = useTranslation();
  return (
    <button
      onClick={setShowChatMenu}
      className={`p-3 cursor-pointer ${classes.primary.hover.bg} transition-all duration-200 border-b-1 border-gray-500 ${isActiveChatButton ? classes.primary.bg : ""} 
        flex items-center justify-start gap-2 whitespace-nowrap
        lg:justify-center lg:flex-col lg:gap-1 lg:text-xs`}
    >
      <div className="w-[30px] h-[30px] flex-shrink-0 flex items-center justify-center">
        <MessageCircle size={30} className="lg:size-20" />
      </div>
      <h2 className="lg:hidden">{t("home.chats")}</h2>
    </button>
  )
}

export default ConversationMenuButton;