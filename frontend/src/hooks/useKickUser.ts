import toast from "react-hot-toast";
import { httpService } from "../core/httpService"
import useConversation from "../store/useConversation"
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";

export const useKickUser = () => {
  const { selectedGroup, setSelectedGroup, userGroups, setUserGroups } = useConversation();
  const { t } = useTranslation();
  const kickUser = async (userId: string) => {
    const kickUserPromise = httpService.post(`/group/kick/${selectedGroup?._id}/${userId}`);

    toast.promise(
      kickUserPromise,
      {
        loading: t("home.kickUserLoading"),
        success: (response) => {
          if (response.data && selectedGroup) {
            setSelectedGroup({
              ...selectedGroup,
              admins: selectedGroup.admins.filter(admin => admin._id !== userId),
              members: selectedGroup.members.filter(member => member.user._id !== userId)
            })
          }
          const updatedUserGroups = userGroups.map((group) => group._id === selectedGroup?._id ? {
            ...group,
            admins: group.admins.filter(admin => admin._id !== userId),
            members: group.members.filter(member => member.user._id !== userId)
          } : group);
          setUserGroups(updatedUserGroups);
          return t("home.userKicked");
        },
        error: (error) => {
          if (error instanceof AxiosError && error.response) {
            const errorMessage = error.response.data?.error;
            if (errorMessage) {
              return errorMessage;
            }
          }
          return t("auth.networkError");
        }
      }
    )
  }

  return { kickUser };
}