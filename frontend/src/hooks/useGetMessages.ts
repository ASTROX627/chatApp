import { useEffect, useState } from "react"
import useConversation from "../store/useConversation";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { httpService } from "../core/httpService";

export const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);

      try {
        const response = await httpService.get(`/messages/${selectedConversation?._id}`);
        const data = response.data.messages;
        
        if (data.error) {
          throw new Error(data.error);
        }

        setMessages(data);

      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    if (selectedConversation?._id) {
      getMessages();
    }
  }, [selectedConversation?._id, setMessages])

  return { loading, messages }

}