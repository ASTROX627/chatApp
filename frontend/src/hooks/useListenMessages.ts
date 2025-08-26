import { useEffect } from "react";
import { useSocketContex } from "../context/socket/socketContext";
import useConversation from "../store/useConversation";
import type { MessageType, GroupMessageType } from "../types/conversations";
import notificationSound from "../assets/sound/notification.mp3"


export const useListenMessages = () => {
  const { socket } = useSocketContex();
  const { messages, setMessages, groupMessages, setGroupMessages, selectedGroup, selectedConversation } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage: MessageType) => {
      if (selectedConversation?._id === newMessage.receiverId || selectedConversation?._id === newMessage.senderId) {
        const updatedMessage: MessageType = {
          ...newMessage,
          fileUrl: newMessage.fileData ? newMessage._id : undefined,
          shouldShake: true
        };
        const sound = new Audio(notificationSound);
        sound.play();
        setMessages([...messages, updatedMessage]);
      }
    });

    socket?.on("newGroupMessage", (newGroupMessage: GroupMessageType) => {
      if (selectedGroup?._id === newGroupMessage.groupId) {
        const updatedMessage: GroupMessageType = {
          ...newGroupMessage,
          fileUrl: newGroupMessage.fileData ? newGroupMessage._id : undefined,
          shouldShake: true
        };
        const sound = new Audio(notificationSound);
        sound.play();
        setGroupMessages([...groupMessages, updatedMessage]);
      }
    });

    return () => {
      socket?.off("newMessage");
      socket?.off("newGroupMessage");
    };
  }, [socket, messages, setMessages, groupMessages, setGroupMessages, selectedGroup, selectedConversation]);
};