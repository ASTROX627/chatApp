import type { FC } from "react"
import type { FieldError, UseFormRegisterReturn } from "react-hook-form"

type GenderProps = {
  register: UseFormRegisterReturn
  genders: string[]
  error: FieldError | undefined
}

const SelectGender: FC<GenderProps> = ({ register, genders, error }) => {
  return (
    <div className="mb-3">
      <label className="label ml-1 mb-2">Gender</label>
      <div className="flex ml-1">
        {genders.map((gender) => (
          <div key={gender} className="form-control mr-3">
            <label className="label gap-2 cursor-pointer">
              <input
                {...register}
                type="radio"
                value={gender}
                className="radio checked:bg-purple-200 checked:text-purple-600"
              />
              <span>{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
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
