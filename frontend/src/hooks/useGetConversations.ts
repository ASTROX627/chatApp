import { useEffect, useState } from "react"
import { httpService } from "../core/httpService";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const response = await httpService.get("/users");
        const data = response.data;

        if (data.error) {
          throw new Error(data.error)
        }
        setConversations(data);
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