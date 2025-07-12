import type { FC, JSX } from "react"
import type { MessageType } from "../../../store/useConversation";
import { useAuthContext } from "../../../context/auth/authContext";
import useConversation from "../../../store/useConversation";
import { useTheme } from "../../../hooks/useTheme";
import { Download, FileText, Image } from "lucide-react";
import { useTranslation } from "react-i18next";

type MessageProps = {
  message: MessageType
}

const Message: FC<MessageProps> = ({ message }): JSX.Element => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const { classes } = useTheme();
  const fromMe = message.senderId === authUser?._id;
  const chatClassName = fromMe ? "chat-end": "chat-start";
  const profilePicture = fromMe? authUser.profilePicture: selectedConversation?.profilePicture;
  const {t} = useTranslation();

  const downloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = `${import.meta.env.VITE_BASE_URL}${fileUrl}`;
    link.download = fileName;
    link.target = "_blank"
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <Image size={16} />
    }
    return <FileText size={16} />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src={profilePicture} alt="user image" />
        </div>
      </div>
      <div className={`chat-bubble text-white ${fromMe ? `${classes.primary.bg} pb-2` : ""}`}>
        {
          message.message && (
            <div className="mb-2">{message.message}</div>
          )
        }
        {
          message.messageType === "image" && message.fileUrl && (
            <div className="max-w-xs">
              <img
                src={`${import.meta.env.VITE_BASE_URL}${message.fileUrl}`}
                alt={message.fileName}
                className="rounded-lg max-w-full h-auto cursor-pointer"
                onClick={() => window.open(`${import.meta.env.VITE_BASE_URL}${message.fileUrl}`, "_blank")}
              />
              {message.fileName && (
                <p className="text-xs text-gray-300 mt-1">{message.fileName}</p>
              )}
            </div>
          )
        }
        {message.messageType === 'file' && message.fileUrl && (
          <div className="bg-gray-600 rounded-lg p-3 max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              {getFileIcon(message.fileMimeType || '')}
              <span className="text-sm truncate flex-1">{message.fileName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-300">
                {message.fileSize && formatFileSize(message.fileSize)}
              </span>
              <button
                onClick={() => downloadFile(message.fileUrl!, message.fileName!)}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Download size={14} />
                <span className="text-xs">{t("home.download")}</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {
          new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        }
      </div>
    </div>
  )
}

export default Message