import type { FC, JSX } from "react"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../../../hooks/useTheme";
import { useForm, type SubmitHandler } from "react-hook-form";
import SelectGroupType from "./SelectGroupType";
import CreateGroupNameInput from "./CreateGroupNameInput";
import { useCreateGroup, type CreateGroupFormValue } from "../../../../hooks/useCreateGroup";

const CreateGroupFrom: FC = (): JSX.Element => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateGroupFormValue>();
  const { t } = useTranslation();
  const { classes } = useTheme();
  const { createGroup } = useCreateGroup();

  const onSubmit: SubmitHandler<CreateGroupFormValue> = async (data) => {
    createGroup(data)
  }

  return (
    <form className="mt-5 md:mt-7" onSubmit={handleSubmit(onSubmit)}>
      <CreateGroupNameInput
        register={register("groupName", {
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