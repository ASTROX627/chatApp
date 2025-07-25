import { useState } from "react"
import useConversation from "../store/useConversation";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { httpService } from "../core/httpService";

export const useJoinGroup = () => {
  const [loading, setLoading] = useState(false);
  const {setSelectedGroup, userGroups, setUserGroups} = useConversation();

  const joinGroup = async(groupId: string) => {
    try {
      setLoading(true)
      const response = await httpService.post(`/group/join/${groupId}`);
      const data = response.data;

      if(data.error){
        throw new Error(data.error);
      }

      setUserGroups([...userGroups, data.group]);
      setSelectedGroup(data.group);

    } catch (error) {
      if(error instanceof AxiosError){
        toast.error(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return {joinGroup, loading}

}