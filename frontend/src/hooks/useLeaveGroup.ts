import { useState } from "react"
import useConversation from "../store/useConversation";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { httpService } from "../core/httpService";

export const useLeaveGroup = () => {
  const [loading, setLoading] = useState(false);
  const {selectedGroup, userGroups, setSelectedGroup, setUserGroups} = useConversation();

  const leavegroup = async (groupId: string) => {
    setLoading(true);
    try {
      const response = await httpService.post(`/group/leave/${groupId}`);
      const data = response.data;

      if(data.error){
        throw new Error(data.error);
      }

      const updatedUsersGroup = userGroups.filter(group => group && group._id !== groupId);
      setUserGroups(updatedUsersGroup);

      if(selectedGroup?._id === groupId){
        setSelectedGroup(null);
      }
    } catch (error) {
      if(error instanceof AxiosError){
        const errorMessage = error.response?.data?.error || error.message
        toast.error(errorMessage)
      }else {
        toast.error("auth.networkError");
      }
    } finally {
      setLoading(false);
    }
  } 

  return {leavegroup, loading};
}