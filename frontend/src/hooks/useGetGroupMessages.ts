import { useEffect, useState } from "react"
import useConversation from "../store/useConversation";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { httpService } from "../core/httpService";
import type { GroupMessageType } from "../types/conversations";

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

        const updatedMessage: GroupMessageType[] = data.map((msg: GroupMessageType) => ({
          ...msg,
          fileUrl: msg.fileData ? msg._id : undefined
        }))

        setGroupMessages(updatedMessage);

      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          const erorrMessage = error.response.data?.error;
          if (erorrMessage) {
            toast.error(erorrMessage)
          }
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