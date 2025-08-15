import toast from "react-hot-toast";
import { httpService } from "../core/httpService"
import useConversation from "../store/useConversation"
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";

export const usePromoteUser = () => {
  const { selectedGroup, setSelectedGroup } = useConversation();
  const { t } = useTranslation();
  const promoteUser = async (userId: string) => {
    const promoteUserPromise = httpService.post(`/group/promote/${selectedGroup?._id}/${userId}`);

    toast.promise(
      promoteUserPromise,
      {
        loading: t("home.promoteUserLoading"),
        success: (response) => {
          if (response.data && selectedGroup) {
            setSelectedGroup({
              ...selectedGroup,
              admins: [...selectedGroup.admins, response.data.promotedUser.user],
              members: selectedGroup.members.map(member => member.user._id === userId ? { ...member, role: "admin" } : member)
            })
          }
          return t("home.userPromoted");
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

  return { promoteUser };
}