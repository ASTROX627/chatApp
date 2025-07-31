import { useEffect, useState } from "react"
import useConversation from "../store/useConversation";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { httpService } from "../core/httpService";

export const useGetGroupMessage = () => {
  const [loading, setLoading] = useState(false);
  const { groupMessages, setGroupMessages, selectedGroup } = useConversation();

  useEffect(() => {
    const getGroupMessage = async () => {
      setLoading(true);

      try {
        const response = await httpService.get(`/group/messages/${selectedGroup?._id}`);
        const data = response.data.groupMessages;
        
        if (data.error) {
          throw new Error(data.error);
        }

        setGroupMessages(data);

      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    if (selectedGroup?._id) {
      getGroupMessage();
    }
  }, [selectedGroup?._id, setGroupMessages])

  return { loading, groupMessages }

}