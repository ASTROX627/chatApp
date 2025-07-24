import { useEffect, useState } from "react"
import useConversation from "../store/useConversation";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { httpService } from "../core/httpService";
import type { GroupType } from "../types/conversations";

const useGetPublicGroups = () => {
  const [loading, setLoading] = useState(false);
  const { publicGroups, setPublicGroups } = useConversation();


  const getPublicGroups = async () => {
    setLoading(true);

    try {
      const response = await httpService.get("/group");
      const data: GroupType[] = response.data;
      if (data) {
        setPublicGroups(data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getPublicGroups();
  }, [setPublicGroups])

  return { loading, publicGroups, refreshPublicGroup: getPublicGroups }
}

export default useGetPublicGroups;