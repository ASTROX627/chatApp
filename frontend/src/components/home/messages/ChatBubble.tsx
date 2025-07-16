import { type FC, type JSX } from "react"
import { useAuthContext } from "../../../context/auth/authContext";
import { useTheme } from "../../../hooks/useTheme";
import ImageMessage from "./ImageMessage";
import FileMessage from "./FileMessage";
import type { MessageType } from "../../../store/useConversation";

type ChatBubbleProps = {
  message: MessageType,
  setModalImageSrc: (src: string) => void,
  setModalImageAlt: (alt: string) => void,
  setIsModalOpen: (value: boolean) => void
}

const ChatBubble: FC<ChatBubbleProps> = ({ message, setIsModalOpen, setModalImageAlt, setModalImageSrc }): JSX.Element => {
  const { classes } = useTheme();
  const { authUser } = useAuthContext();
  const fromMe = message.senderId === authUser?._id;

  const openImageModal = (src: string, alt: string) => {
    setModalImageSrc(src);
    setModalImageAlt(alt);
    setIsModalOpen(true);
  };

  return (
    <div className={`chat-bubble text-white ${fromMe ? `${classes.primary.bg} pb-2` : ""}`}>
      {
        message.message && (
          <div className="mb-2">{message.message}</div>
        )
      }

      {
        message.messageType === "image" && message.fileUrl && (
          <ImageMessage
            fileName={message.fileName}
            fileUrl={message.fileUrl}
            onClick={openImageModal}
          />
        )
      }

      {
        message.messageType === "file" && message.fileUrl && (
          <FileMessage
            fileUrl={message.fileUrl}
            fileMimeType={message.fileMimeType}
            fileName={message.fileName}
            fileSize={message.fileSize}
          />
        )
      }
    </div>
  )
}

export default ChatBubble