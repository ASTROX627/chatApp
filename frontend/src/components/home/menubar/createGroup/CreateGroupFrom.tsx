import type { FC, JSX } from "react"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../../../hooks/useTheme";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { httpService } from "../../../../core/httpService";
import { AxiosError } from "axios";
import SelectGroupType from "./SelectGroupType";
import CreateGroupNameInput from "./CreateGroupNameInput";

type CreateGroupFormValue = {
  groupName: string
  groupType: "group" | "channel"
}

const CreateGroupFrom: FC = (): JSX.Element => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateGroupFormValue>();

  const { t } = useTranslation();
  const { classes } = useTheme();

  const onSubmit: SubmitHandler<CreateGroupFormValue> = async (data) => {
    const createGroupPromise = httpService.post("/group/create", data);
    toast.promise(
      createGroupPromise,
      {
        loading: t("home.createGroupLoading"),
        success: (response) => {
          if (response.status === 201) {
            console.log("data:", response.data);
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
  return (
    <form className="p-2 mt-5" onSubmit={handleSubmit(onSubmit)}>
      <CreateGroupNameInput
        register={register("groupName",{
          required: t("home.groupNameRequired")
        })}
        error={errors.groupName}
      />
      <SelectGroupType
        register={register("groupType", {
          required: t("home.selectTyperequired"),
          validate: (value) => {
            if (value !== "channel" && value !== "group") {
              return t("home.selectTypeValidate")
            }
          }
        })}
        error={errors.groupType}
      />
      <div className="text-center mt-7">
        <button
          type="submit"
          className={`text-sm py-2 px-3 rounded-md transition-all duration-200 cursor-pointer border-0 ${classes.primary.bg} hover:bg-gray-600 ring-0 ${classes.primary.hover.text} hover:outline ${classes.primary.hover.outline}`}
        >
          {t("home.createGroup")}
        </button>
      </div>
    </form>
  )
}

export default CreateGroupFrom