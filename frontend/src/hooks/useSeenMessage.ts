import { useEffect } from "react";
import { httpService } from "../core/httpService";
import { useSocketContex } from "../context/socket/socketContext";
import useConversation from "../store/useConversation";
import { useAuthContext } from "../context/auth/authContext";
import type { MessageType, GroupMessageType } from "../types/conversations";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useSeenMessage = () => {
  const { socket } = useSocketContex();
  const { messages, setMessages, groupMessages, setGroupMessages, selectedConversation, selectedGroup } = useConversation();
  const { authUser } = useAuthContext();

  const seenMessage = async (messageId: string) => {
    try {
      await httpService.post(`/seen/message/${messageId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
    }
  };

  const seenGroupMessage = async (messageId: string) => {
    try {
      await httpService.post(`/seen/group-message/${messageId}`);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const erorrMessage = error.response.data?.error;
        if (erorrMessage) {
          toast.error(erorrMessage)
        }
      }
    }
  };

  useEffect(() => {
    if (selectedConversation?._id && authUser?._id) {
      messages.forEach((message: MessageType) => {
        if (
          message.receiverId === authUser._id &&
          !message.isSeen &&
          message.senderId !== authUser._id
        ) {
          seenMessage(message._id!);
        }
      });
    }

    if (selectedGroup?._id && authUser?._id) {
      groupMessages.forEach((message: GroupMessageType) => {
        if (
          !message.seenBy?.includes(authUser._id) &&
          message.senderId._id !== authUser._id
        ) {
          seenGroupMessage(message._id);
        }
      });
    }

    socket?.on("messageSeen", ({ messageId }: { messageId: string }) => {
      setMessages(
        messages.map((message) =>
          message._id === messageId ? { ...message, isSeen: true } : message
        )
      );
    });

    socket?.on("groupMessageSeen", ({ messageId, seenBy }: { messageId: string; seenBy: string[] }) => {
      setGroupMessages(
        groupMessages.map((message) =>
          message._id === messageId ? { ...message, seenBy } : message
        )
      );
    });

    return () => {
      socket?.off("messageSeen");
      socket?.off("groupMessageSeen");
    };
  }, [socket, messages, groupMessages, selectedConversation, selectedGroup, authUser, setMessages, setGroupMessages]);
};