import type { FC, JSX } from "react"
import type { GroupMessageType } from "../../../types/conversations"

type GroupChatFooterProps = {
  message: GroupMessageType
}

const GroupChatFooter: FC<GroupChatFooterProps> = ({ message }): JSX.Element => {
  return (
    <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
      {
        new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      }
    </div>
  )
}

export default GroupChatFooter