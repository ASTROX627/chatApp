import { useState } from "react"
import useConversation from "../store/useConversation";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { httpService } from "../core/httpService";

export const useJoinGroup = () => {
  const [loading, setLoading] = useState(false);
  const { setSelectedGroup, userGroups, setUserGroups, selectedGroup } = useConversation();

  const joinGroup = async (groupId: string) => {
    setLoading(true)
    try {
      const response = await httpService.post(`/group/join/${groupId}`);
      const data = response.data;

      if (data.error) {
        throw new Error(data.error);
      }

      const updatedUserGroups = [...userGroups, data.group];
      setUserGroups(updatedUserGroups);
      if(selectedGroup?._id === groupId){
        setSelectedGroup(data.group);
      }

    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return { joinGroup, loading }

}