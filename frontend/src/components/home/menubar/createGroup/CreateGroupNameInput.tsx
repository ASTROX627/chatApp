import type { FC, JSX } from "react"
import type { FieldError, UseFormRegisterReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

type CreateGroupNameInputProps = {
  register: UseFormRegisterReturn,
  error: FieldError | undefined
}

const CreateGroupNameInput: FC<CreateGroupNameInputProps> = ({ register, error }): JSX.Element => {
  const { t } = useTranslation();
  return (
    <>
      <label className="label mb-2">{t("home.enterGroupName")}</label>
      <input
        {...register}
        type="text"
        className={`input w-full ${error ? "border-red-500" : ""} placeholder:text-gray-400`}
        placeholder={t("home.groupNamePlaceholder")}
      />
      {
        error && (
          <p className="text-red-500 text-sm ml-1 mt-1">{error.message}</p>
        )
      }
    </>
  )
}

export default CreateGroupNameInput