import { useEffect, useState } from "react";
import { httpService } from "../core/httpService";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import useConversation, { type GroupType } from "../store/useConversation";

const useGetUserGroups = () => {
  const [loading, setLoading] = useState(false);
  const {userGroups, setUserGroups} = useConversation();

  useEffect(() => {
    const getUserGroups = async () => {
      setLoading(true);

      try {
        const response = await httpService.get("/group/user");
        const data: GroupType[] = response.data;
        if(data){
          setUserGroups(data);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.message)
        }
      } finally {
        setLoading(false)
      }
    }
    getUserGroups();

  }, [setUserGroups])

  return { loading, userGroups };
}

export default useGetUserGroups;