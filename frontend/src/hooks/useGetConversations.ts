import { useEffect, useState } from "react"
import { httpService } from "../core/httpService";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import type { ConversationType } from "../types/conversations";

type UserApiResponse = {
  _id: string,
  username: string,
  profilePicture: string
}

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationType[]>([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const response = await httpService.get("/users");
        const data = response.data;

        if (data.error) {
          throw new Error(data.error)
        }

        const conversationsWithType = data.map((conv: UserApiResponse) => ({
          ...conv,
          emoji: null,
          type: "user" as const
        }))
      
        setConversations(conversationsWithType);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.message)
        }
      } finally {
        setLoading(false);
      }
    }

    getConversations();
  }, []);

  return { loading, conversations }
}

export default useGetConversations;