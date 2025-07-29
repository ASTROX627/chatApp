import toast from "react-hot-toast"
import { httpService } from "../core/httpService"
import { useTranslation } from "react-i18next"
import { AxiosError } from "axios"

export type CreateGroupFormValue = {
  groupName: string
  groupType: "group" | "channel"
}

export const useCreateGroup = () => {
  const { t } = useTranslation();
  const createGroup = async (data: CreateGroupFormValue) => {
    const createGroupPromise = httpService.post("/group/create", data);
    toast.promise(
      createGroupPromise,
      {
        loading: t("home.createGroupLoading"),
        success: (response) => {
          if (response.status === 201) {
            return t("home.createGroupSuccess")
          }
          return t("auth.networkError");
        },
        error: (error) => {
          if (error instanceof AxiosError && error.response) {
            const errorMessage = error.response.data?.error;
            if (errorMessage) {
              return errorMessage
            }
          }
          return t("auth.networkError")
        }
      }
    )
  }

  return { createGroup };
}