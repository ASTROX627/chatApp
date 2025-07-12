import { useEffect } from "react";
import useConversation from "../../../store/useConversation";
import MessageInput from "./MessageInput"
import Messages from "./Messages"
import NoChatSelected from "./NoChatSelected";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className="w-[40vw] flex flex-col h-full">
      {
        !selectedConversation ? (
          <NoChatSelected />
        ) : (
          <>
            <div className="bg-slate-500 px-4 py-2 mb-2 flex items-center gap-2">
              <div className="avatar avatar-online">
                <div className="w-12 rounded-full">
                  <img src={selectedConversation.profilePicture} alt="user image" />
                </div>
              </div>
              <span className="text-gray-900 font-bold">{selectedConversation.username}</span>
            </div>
            <Messages />
            <MessageInput />
          </>
        )
      }
    </div>
  )
}

export default MessageContainer