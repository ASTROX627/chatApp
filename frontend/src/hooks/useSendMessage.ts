import { useState } from "react"
import { httpService } from "../core/httpService";
import useConversation from "../store/useConversation";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async (message: string, file?: File) => {
    setLoading(true);

    try {
      const formData = new FormData();

      if (message.trim()) {
        formData.append("message", message);
      }

      if (file) {
        formData.append("file", file);
      }

      const response = await httpService.post(
        `/messages/send/${selectedConversation?._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      const data = response.data;      
      

      if (data.error) {
        throw new Error(data.error);
      }
      setMessages([...messages, data.newMessage])

    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false)
    }
  }

  return { sendMessage, loading }
}