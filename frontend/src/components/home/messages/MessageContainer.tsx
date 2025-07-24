import Messages from "./Messages"
import NoChatSelected from "./NoChatSelected";
import { useAppContext } from "../../../context/app/appContext";
import { ArrowLeft, ArrowRight, Hash, Lock, Users } from "lucide-react";
import { useEffect, type FC, type JSX } from "react";
import useConversation from "../../../store/useConversation";
import { useTranslation } from "react-i18next";
import MessageInput from "./MessageInput";

const MessageContainer:FC = ():JSX.Element => {
  const { selectedConversation, selectedGroup, setSelectedConversation, setSelectedGroup } = useConversation();
  const { showMessageContainer, setShowChatMenu, language } = useAppContext();
  const {t} = useTranslation();

  useEffect(() => {
    return () => {
      setSelectedConversation(null);
      setSelectedGroup(null);
    }
  }, [setSelectedConversation, setSelectedGroup]);

  const activeChat = selectedConversation || selectedGroup;

  return (
    <div className={`h-full overflow-auto scrollbar scrollbar-track-neutral-700 scrollbar-thumb-neutral-900 hover:scrollbar-thumb-neutral-800 border-gray-500 rounded-e-md
      ${showMessageContainer ? "w-full" : "w-0"}
      lg:w-full lg:block flex`}>
      {!activeChat ? (
        <NoChatSelected />
      ) : (
        <div className="flex flex-col justify-between h-full">
          <nav className="bg-slate-500 px-4 py-4 mb-2 flex items-center gap-2 z-10 w-full sticky top-0">
            <button
              onClick={setShowChatMenu}
              className="cursor-pointer lg:hidden" 
            >
              {language === "en" ? <ArrowLeft size={32} /> : <ArrowRight size={32} />}
            </button>
            <div className="avatar avatar-online">
              <div className="w-12 rounded-full">
                <img 
                  src={selectedConversation?.profilePicture || selectedGroup?.groupImage} 
                  alt="chat image" 
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedGroup && (
                <div className="flex items-center gap-1">
                  {selectedGroup.groupType === "channel" ? (
                    <Hash size={16} className="text-gray-400" />
                  ) : (
                    <Users size={16} className="text-gray-400" />
                  )}
                  {selectedGroup.isPrivate && (
                    <Lock size={14} className="text-yellow-400" />
                  )}
                </div>
              )}
              <span className="text-gray-900 font-bold">
                {selectedConversation?.username || selectedGroup?.groupName}
              </span>
              {selectedGroup && (
                <span className="text-sm text-gray-600">
                  ({selectedGroup.members.length} {t("home.members")})
                </span>
              )}
            </div>
          </nav>
          <Messages />
          <MessageInput />
        </div>
      )}
    </div>
  )
}

export default MessageContainer