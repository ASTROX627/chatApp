import { Eye, EyeOff } from "lucide-react"
import type { FC } from "react"
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

type AuthInputProps = {
  label: string
  register: UseFormRegisterReturn
  type: "text" | "password"
  placeholder: string
  isPassword?: boolean
  showPassword?: boolean
  toggleShowPassword?: () => void
  error?: FieldError
}

const AuthInputs: FC<AuthInputProps> = ({ label, register, type, placeholder, isPassword, showPassword, toggleShowPassword, error }) => {
  return (
    <>
      <label className="label ml-1 mb-1 text-sm lg:text-base">{label}</label>
      <div className="relative">
        <input
          {...register}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={`input w-full ${error ? "border-red-500 mb-1" : "mb-4"} text-sm md:text-base placeholder:text-sm`}
          placeholder={placeholder}
        />
        {
          isPassword && (
            showPassword ? (
              <EyeOff
                size={20}
                onClick={toggleShowPassword}
                className="absolute cursor-pointer ltr:right-1.5 rtl:left-1.5 top-1/5 z-10"
              />
            ) : (
              <Eye
                size={20}
                onClick={toggleShowPassword}
                className="absolute cursor-pointer ltr:right-1.5 rtl:left-1.5 top-1/5 z-10"
              />
            )
          )
        }
      </div>
      {error && (
        <p className="text-red-500 text-sm mb-2 ml-1">{error.message}</p>
      )}
    </>
  )
}

export default AuthInputs;
