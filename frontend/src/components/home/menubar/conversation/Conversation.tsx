import type { FC, ReactNode } from "react"
import type { ConversationType } from "../../../../store/useConversation"
import useConversation from "../../../../store/useConversation"
import { useTheme } from "../../../../hooks/useTheme"

type ConversationProps = {
  conversation: ConversationType,
  emoji: ReactNode,
  lastIndex: boolean,
}

const Conversation: FC<ConversationProps> = ({ conversation, emoji, lastIndex }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { classes } = useTheme();

  const isSelected = selectedConversation?._id === conversation._id;

  return (
    <>
      <div
        onClick={() => setSelectedConversation(conversation)}
        className={`flex gap-2 items-center justify-center ${classes.primary.hover.bg} rounded px-2 py-1 cursor-pointer ${isSelected ? `${classes.primary.bg}` : ""}`}
      >
        <div className="avatar avatar-online">
          <div className="w-12 rounded-full">
            <img src={conversation.profilePicture} alt="user image" />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex justify-between">
            <p className="font-bold text-gray-200">{conversation.username}</p>
            <span className="text-xl">{emoji}</span>
          </div>
        </div>
      </div>
      {
        (!lastIndex) && <div className="border-b-1 border-gray-500"></div>
      }
    </>
  )
}

export default Conversation;