import type { FC, JSX } from "react"
import type { GroupMessageType } from "../../../types/conversations"
import { useAuthContext } from "../../../context/auth/authContext"
import { useTheme } from "../../../hooks/useTheme"
import { twMerge } from "tailwind-merge"

type GroupChatFooterProps = {
  message: GroupMessageType
}

const GroupChatFooter: FC<GroupChatFooterProps> = ({ message }): JSX.Element => {
  const {authUser} = useAuthContext();
  const {classes} = useTheme();
  const fromMe = message.senderId._id === authUser?._id;

  return (
    <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
      <span>
      {
        new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      }
      </span>
      {fromMe && message.seenBy && message.seenBy?.length > 0 ? <span className={twMerge(classes.secondary.text)}>✔✔</span>: <span className={twMerge(classes.secondary.text)}>✔</span>}
    </div>
  )
}

export default GroupChatFooter