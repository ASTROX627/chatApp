import { useState } from "react"
import useConversation from "../store/useConversation";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { httpService } from "../core/httpService";

export const useGetGroupProfile = () => {
  const [loading, setLoading] = useState(false);
  const { setSelectedGroup } = useConversation();

  const getGroupProfile = async (groupId: string) => {
    if (!groupId || groupId === 'undefined') {
      console.error('Invalid groupId:', groupId);
      return null;
    }
    setLoading(true);

    try {
      const response = await httpService.get(`/profile/group/${groupId}`);
      const data = response.data;

      if (data.error) {
        throw new Error(data.error)
      }

      setSelectedGroup(data.group);
      console.log(data.group);

      return data.group;

    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const erorrMessage = error.response.data?.error;
        if (erorrMessage) {
          toast.error(erorrMessage)
        }
      }
      return null;

    } finally {
      setLoading(false);
    }
  }

  return { loading, getGroupProfile };
}