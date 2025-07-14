import type { FC } from "react"
import type { FieldError, UseFormRegisterReturn } from "react-hook-form"
import { useTheme } from "../../../hooks/useTheme"
import { useTranslation } from "react-i18next"
import { useAppContext } from "../../../context/app/appContext"

type SelectGenderProps = {
  register: UseFormRegisterReturn
  genders: string[]
  error: FieldError | undefined
}

const SelectGender: FC<SelectGenderProps> = ({ register, genders, error }) => {
  const { classes } = useTheme();
  const { language } = useAppContext();
  const { t } = useTranslation();
  return (
    <div className="mb-3">
      <label className="label ml-1 mb-2 text-sm">{t("auth.gender")}</label>
      <div className="flex ml-1">
        {genders.map((gender) => (
          <div key={gender} className="form-control mr-3">
            <label className="label gap-2 cursor-pointer text-sm">
              <input
                {...register}
                type="radio"
                value={gender}
                className={`radio radio-sm ${classes.secondary.checked.bg} ${classes.primary.checked.text} transition-all duration-200`}
              />
              {
                language === "en" ? (
                  <span>{t(`auth.genders.${gender}`).charAt(0).toUpperCase() + gender.slice(1)}</span>
                ) : (
                  <span>{t(`auth.genders.${gender}`)}</span>
                )
              }
            </label>
          </div>
        ))}
      </div>
      {error && (
        <p className="text-red-500 text-sm ml-1">{error.message}</p>
      )}
    </div>
  )
}

export default SelectGender
