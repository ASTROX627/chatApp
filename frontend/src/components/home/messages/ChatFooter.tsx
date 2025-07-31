import type { FC, JSX } from "react"
import type { MessageType } from "../../../types/conversations"

type ChatFooterProps = {
  message: MessageType
}

const ChatFooter: FC<ChatFooterProps> = ({ message }): JSX.Element => {
  return (
    <div className="chat-footer opacity-50 text-xs flex gap-1 items-center mt-1">
      {
        new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      }
    </div>
  )
}

export default ChatFooter
