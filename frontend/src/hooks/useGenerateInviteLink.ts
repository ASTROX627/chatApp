import { AxiosError } from "axios";
import { useState } from "react"
import toast from "react-hot-toast";
import { httpService } from "../core/httpService";
import useConversation from "../store/useConversation";
import { useTranslation } from "react-i18next";

export const useGenerateInviteLink = () => {
  const {selectedGroup} = useConversation();
  const [inviteUrl, setInviteUrl] = useState("");
  const {t} = useTranslation();
  const generateInviteLink = async (invitedId: string) => {
    const generateInviteLinkPromise = httpService.post(`/group/invite/${selectedGroup?._id}`,{
        invitedId
      })
    toast.promise(
      generateInviteLinkPromise,
      {
        loading: t("home.sendInviteLoading"),
        success: (response) => {
          if(response.data.inviteData){
            setInviteUrl(response.data.inviteData.inviteUrl);
            return t("home.sendIviteSuccess")
          }
          return t("auth.networkError");
        },
        error: (error) => {
          if(error instanceof AxiosError && error.response){
            const errorMessage = error.response.data?.error;
            if(errorMessage){
              return errorMessage;
            }
          }
          return t("auth.networkError");
        }
      }
    )
  }

  return {generateInviteLink, inviteUrl}
}