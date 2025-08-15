import toast from "react-hot-toast";
import { httpService } from "../core/httpService"
import useConversation from "../store/useConversation"
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";

export const useDemoteUser = () => {
  const { selectedGroup, setSelectedGroup } = useConversation();
  const { t } = useTranslation();
  const demoteUser = async (userId: string) => {
    const demoteUserPromise = httpService.post(`/group/demote/${selectedGroup?._id}/${userId}`);

    toast.promise(
      demoteUserPromise,
      {
        loading: t("home.demoteUserLoading"),
        success: (response) => {
          if (response.data && selectedGroup) {
            setSelectedGroup({
              ...selectedGroup,
              admins: selectedGroup.admins.filter(admin => admin._id !== userId),
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

  return { demoteUser };
}