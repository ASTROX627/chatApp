import { useState } from "react"
import type { GroupType } from "../types/conversations";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { httpService } from "../core/httpService";

export const useGetPrivateGroup = () => {
  const [loading, setLoading] = useState(false);
  const [privateGroup, setPrivateGroup] = useState<GroupType | null>(null);

  const getPrivateGroup = async (inviteCode: string) => {
    setLoading(true);
    try {
      const response = await httpService.get(`/group/invite/${inviteCode}`);
      const data = response.data;
      if (data.error) {
        throw new Error(data.error)
      }

      setPrivateGroup(data.group);
      return data.group;

    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message)
      }
      return null
    } finally {
      setLoading(false)
    }
  }
  return { loading, privateGroup, getPrivateGroup }

}