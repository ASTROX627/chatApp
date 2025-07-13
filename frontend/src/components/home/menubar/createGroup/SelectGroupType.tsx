import type { FC, JSX } from "react"
import type { FieldError, UseFormRegisterReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

type SelectGroupTypeProps = {
  register: UseFormRegisterReturn,
  error: FieldError | undefined
}

const SelectGroupType: FC<SelectGroupTypeProps> = ({ register, error }): JSX.Element => {
  const { t } = useTranslation();

  const groupTypes = [
    { value: "group", label: t("home.groupTypes.group") },
    { value: "channel", label: t("home.groupTypes.channel") },
  ];


  return (
    <>
      <select
        {...register}
        className={`select mt-5 ${error ? "borer-red-500" : ""}`}
        defaultValue={t("home.selectGroupType")}
      >
        <option disabled={true}>{t("home.selectGroupType")}</option>
        {
          groupTypes.map((groupType) => (
            <option key={groupType.value} value={groupType.value}>{groupType.label}</option>
          ))
        }
      </select>
      {error && <p className="text-red-500 text-sm ml-1 mt-1">{error.message}</p>}
    </>
  )
}

export default SelectGroupType;