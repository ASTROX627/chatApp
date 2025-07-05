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
      <label className="label ml-1 mb-1">{label}</label>
      <div className="relative">
        <input
          {...register}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={`input w-full ${error ? "border-red-500 mb-1" : "mb-4"}`}
          placeholder={placeholder}
        />
        {
          isPassword && (
            showPassword ? (
              <EyeOff
                size={20}
                onClick={toggleShowPassword}
                className="absolute cursor-pointer right-1.5 top-2.5 z-1"
              />
            ) : (
              <Eye
                size={20}
                onClick={toggleShowPassword}
                className="absolute cursor-pointer right-1.5 top-2.5 z-1"
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
