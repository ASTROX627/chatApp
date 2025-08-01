import { AxiosError } from "axios";
import { useState } from "react"
import toast from "react-hot-toast";
import { httpService } from "../core/httpService";
import useConversation from "../store/useConversation";

export const useGetUserProfile = () => {
  const [loading, setLoading] = useState(false);
  const { setSelectedConversation } = useConversation();

  const getUserProfile = async (userId: string) => {
    setLoading(true);

    try {
      const response = await httpService.get(`/profile/user/${userId}`);
      const data = response.data;

      if (data.error) {
        throw new Error(data.error);
      }

      setSelectedConversation(data.user);
      return data.user;

    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
      return null;

    } finally {
      setLoading(false);
    }
  }

  return { loading, getUserProfile };
}