import { useState } from "react"
import { httpService } from "../core/httpService";
import useConversation from "../store/useConversation";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useSendGroupMessage = () => {
  const [loading, setLoading] = useState(false);
  const { groupMessages, setGroupMessages, selectedGroup } = useConversation();

  const sendGroupMessage = async (message: string, file?: File) => {
    setLoading(true);

    try {
      const formData = new FormData();
      if (message.trim()) formData.append("message", message);
      if (file) formData.append("file", file);

      const response = await httpService.post(
        `/group/send/${selectedGroup?._id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const newMessage = response.data.newGroupMessage; 
      setGroupMessages([...groupMessages, newMessage]);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return { sendGroupMessage, loading }
}