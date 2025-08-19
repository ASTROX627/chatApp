import { useEffect } from "react";
import { useSocketContex } from "../context/socket/socketContext"
import useConversation from "../store/useConversation";

export const useListenMessages = () =>  {
  const {socket} = useSocketContex();
  const {messages, setMessages, groupMessages, setGroupMessages} = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setMessages([...messages, newMessage])
    })

    return () => {
      socket?.off("newMessage");
    }
  }, [messages, setMessages, socket]);

  useEffect(() => {
    socket?.on("newGroupMessage", (newGroupMessage) => {
      setGroupMessages([...groupMessages, newGroupMessage])
    })

    return () => {
      socket?.off("newGroupMessage")
    }
  }, [groupMessages, setGroupMessages, socket])
}