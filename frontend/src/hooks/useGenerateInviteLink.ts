import { AxiosError } from "axios";
import { useState } from "react"
import toast from "react-hot-toast";
import { httpService } from "../core/httpService";
import useConversation from "../store/useConversation";

export const useGenerateInviteLink = () => {
  const {selectedGroup} = useConversation();
  const [loading, setLoading] = useState(false);
  const [inviteUrl, setInviteUrl] = useState("");
  const generateInviteLink = async (invitedId: string) => {
    setLoading(true);
    try {
      const response = await httpService.post(`/group/invite/${selectedGroup?._id}`,{
        invitedId
      })

      if(response.data.inviteData){
        setInviteUrl(response.data.inviteData.inviteUrl);
      }

    } catch (error) {
      if(error instanceof AxiosError){
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return {generateInviteLink, loading}
}