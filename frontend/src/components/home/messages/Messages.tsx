import { useEffect, useRef } from "react";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { useTranslation } from "react-i18next";
import MessageContent from "./MessageContent";
import { useGetMessages } from "../../../hooks/useGetMessages";
import { useGetGroupMessage } from "../../../hooks/useGetGroupMessages";
import useConversation from "../../../store/useConversation";
import GroupMessageContent from "./GroupMessageContent";
import type { MessageType, GroupMessageType } from "../../../types/conversations";

const Messages = () => {
  const { selectedGroup } = useConversation();
  const { messages, loading: privateLoading } = useGetMessages();
  const { groupMessages, loading: groupLoading } = useGetGroupMessage();
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const isChatGroup = !!selectedGroup;
  const loading = isChatGroup ? groupLoading : privateLoading;
  const currentMessages = isChatGroup ? groupMessages : messages;
  const hasMessages = isChatGroup ? groupMessages.length > 0 : messages.length > 0;

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentMessages]) 

  return (
    <div className="px-4 flex-1 overflow-auto scrollbar scrollbar-track-neutral-700 scrollbar-thumb-neutral-900 hover:scrollbar-thumb-neutral-800">
      {
        !loading && hasMessages && (
          currentMessages.map((message: MessageType | GroupMessageType, index) => {
            const isLastMessage = index === currentMessages.length - 1;
            if (!message) return null;

            return (
              <div
                key={message._id}
                ref={isLastMessage ? lastMessageRef : null}
              >
                {isChatGroup ? (
                  <GroupMessageContent message={message as GroupMessageType} />
                ) : (
                  <MessageContent message={message as MessageType} />
                )}
              </div>
            )
          })
        )
      }
      {
        !loading && !hasMessages && (
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