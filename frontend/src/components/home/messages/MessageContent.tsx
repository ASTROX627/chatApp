import type { FC, JSX } from "react"
import { useState } from "react"
import type { MessageType } from "../../../store/useConversation";
import { useAuthContext } from "../../../context/auth/authContext";
import useConversation from "../../../store/useConversation";
import Modal from "../../modal/Modal";
import ChatBubble from "./ChatBubble";
import ChatFooter from "./ChatFooter";

export type MessageContentProps = {
  message: MessageType,
}

const MessageContent: FC<MessageContentProps> = ({ message }): JSX.Element => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const fromMe = message.senderId === authUser?._id;
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePicture = fromMe ? authUser.profilePicture : selectedConversation?.profilePicture;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");
  const [modalImageAlt, setModalImageAlt] = useState("");

  const closeImageModal = () => {
    setIsModalOpen(false);
    setModalImageSrc("");
    setModalImageAlt("");
  };

  return (
    <>
      <div className={`chat ${chatClassName}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src={profilePicture} alt="user image" />
          </div>
        </div>
        <ChatBubble
          setIsModalOpen={setIsModalOpen}
          setModalImageAlt={setModalImageAlt}
          setModalImageSrc={setModalImageSrc}
          message={message}
        />
        <ChatFooter
          message={message}
        />
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

export default MessageContent;