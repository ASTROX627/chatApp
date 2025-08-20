import type { FC, JSX } from "react"
import type { MessageType } from "../../../types/conversations"
import { useAuthContext } from "../../../context/auth/authContext"
import { useTheme } from "../../../hooks/useTheme"
import { twMerge } from "tailwind-merge"

type ChatFooterProps = {
  message: MessageType
}

const ChatFooter: FC<ChatFooterProps> = ({ message }): JSX.Element => {
  const {authUser} = useAuthContext();
  const {classes} = useTheme();
  const fromMe = message.senderId === authUser?._id;
  return (
    <div className="chat-footer opacity-50 text-xs flex gap-1 items-center mt-1">
      <span>
      {
        new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      }
      </span>
      {fromMe && message.isSeen ? <span className={twMerge(classes.secondary.text)}>✔✔</span>: <span className={twMerge(classes.secondary.text)}>✔</span>}
    </div>
  )
}

export default ChatFooter
