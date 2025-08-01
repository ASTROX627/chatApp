import { useState } from "react"
import useConversation from "../store/useConversation";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { httpService } from "../core/httpService";

export const useGetGroupProfile = () => {
  const [loading, setLoading] = useState(false);
  const { setSelectedGroup } = useConversation();

  const getGroupProfile = async (groupId: string) => {
    setLoading(true);

    try {
      const response = await httpService.get(`/profile/group/${groupId}`);
      const data = response.data;

      if (data.error) {
        throw new Error(data.error)
      }

      setSelectedGroup(data.group);
      return data.group;

    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
      return null;

    } finally {
      setLoading(false);
    }
  }

  return { loading, getGroupProfile };
}