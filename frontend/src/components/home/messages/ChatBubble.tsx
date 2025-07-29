import { type FC, type JSX } from "react"
import { useAuthContext } from "../../../context/auth/authContext";
import { useTheme } from "../../../hooks/useTheme";
import ImageMessage from "./ImageMessage";
import FileMessage from "./FileMessage";
import type { MessageType } from "../../../types/conversations";
import LinkMessage from "./LinkMessage";

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

  const renderLinkMessages = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 underline hover:text-blue-200 break-all"
          >
            {part}
          </a>
        )
      }
      return part;
    })
  }

  return (
    <div className={`chat-bubble text-white ${fromMe ? `${classes.primary.bg} pb-2` : ""}`}>
      {
        message.message && (
          <div className="mb-2">{renderLinkMessages(message.message)}</div>
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

      {
        message.messageType === "link" && (
          <LinkMessage 
            url={message.message}
          />
        )
      }
    </div>
  )
}

export default ChatBubble