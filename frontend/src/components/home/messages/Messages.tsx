import { useEffect, useRef } from "react";
import { useGetMessages } from "../../../hooks/useGetMessages"
import type { MessageType } from "../../../store/useConversation";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message"
import { useTranslation } from "react-i18next";

const Messages = () => {
  const { messages, loading } = useGetMessages();
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const {t} = useTranslation();

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="px-4 flex-1 overflow-auto scrollbar scrollbar-track-neutral-700 scrollbar-thumb-neutral-900 hover:scrollbar-thumb-neutral-800">
      {
        !loading && messages.length > 0 && (
          messages.map((message: MessageType, index) => {
            const isLastMessage = index === messages.length -1;
            return (
              <div
                key={message._id}
                ref={isLastMessage? lastMessageRef: null}
              >
                <Message
                  message={message}
                />
              </div>
            )
          })
        )
      }
      {
        !loading && messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="font-semibold text-lg">{t("home.startConversation")}</p>
          </div>
        )
      }
      {
        loading && [...Array(3)].map((_, index) => <MessageSkeleton key={index} />)
      }
    </div>
  )
}

export default Messages