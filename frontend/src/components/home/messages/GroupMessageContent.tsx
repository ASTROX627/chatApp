import type { FC, JSX } from "react"
import { useState } from "react"
import { useAuthContext } from "../../../context/auth/authContext";
import useConversation from "../../../store/useConversation";
import Modal from "../../modal/Modal";
import ChatBubble from "./ChatBubble";
import GroupChatFooter from "./GroupChatFooter";
import type { GroupMessageType } from "../../../types/conversations";


export type GroupMessageContentProps = {
  message: GroupMessageType,
}

const GroupMessageContent: FC<GroupMessageContentProps> = ({ message }): JSX.Element => {
  const { authUser } = useAuthContext();
  const { selectedGroup } = useConversation();
  const fromMe = message.senderId._id === authUser?._id;
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePicture = fromMe ? authUser.profilePicture : message.senderId.profilePicture;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");
  const [modalImageAlt, setModalImageAlt] = useState("");

  const closeImageModal = () => {
    setIsModalOpen(false);
    setModalImageSrc("");
    setModalImageAlt("");
  };

  const messageForBubble = {
    ...message,
    senderId: message.senderId._id,
    receiverId: selectedGroup?._id || "",
  };

  return (
    <>
      <div className={`chat ${chatClassName}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src={profilePicture} alt="user image" />
          </div>
        </div>
        {!fromMe && (
          <div className="chat-header text-xs opacity-70 mb-1">
            {message.senderId.username}
          </div>
        )}
        <ChatBubble
          setIsModalOpen={setIsModalOpen}
          setModalImageAlt={setModalImageAlt}
          setModalImageSrc={setModalImageSrc}
          message={messageForBubble}
        />
        <GroupChatFooter message={message} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeImageModal}
        src={modalImageSrc}
        alt={modalImageAlt}
      />
    </>
  )
}

export default GroupMessageContent;