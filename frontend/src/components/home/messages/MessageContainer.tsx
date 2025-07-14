import { useEffect } from "react";
import useConversation from "../../../store/useConversation";
import MessageInput from "./MessageInput"
import Messages from "./Messages"
import NoChatSelected from "./NoChatSelected";
import { useAppContext } from "../../../context/app/appContext";
import { ArrowLeft, ArrowRight } from "lucide-react";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { showMessageContainer, setShowChatMenu, language } = useAppContext();

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    showMessageContainer && (
      <div className="h-full w-full overflow-auto scrollbar scrollbar-track-neutral-700 scrollbar-thumb-neutral-900 hover:scrollbar-thumb-neutral-800 border-gray-500 rounded-lg">
        {
          !selectedConversation ? (
            <NoChatSelected />
          ) : (
            <>
              <nav className="bg-slate-500 px-4 py-2 mb-2 flex items-center gap-2 z-10 w-full sticky top-0">
                <button onClick={setShowChatMenu} className="cursor-pointer">
                  {language === "en"? <ArrowLeft size={32}/> : <ArrowRight size={32}/>
                  }
                </button>
                <div className="avatar avatar-online">
                  <div className="w-12 rounded-full">
                    <img src={selectedConversation.profilePicture} alt="user image" />
                  </div>
                </div>
                <span className="text-gray-900 font-bold">{selectedConversation.username}</span>
              </nav>
              <Messages />
              <MessageInput />
            </>
          )
        }
      </div>
    )
  )
}

export default MessageContainer