import { useState, type FC, type JSX } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"
import AuthInputs from "../../components/auth/AuthInputs"
import SelectGender from "./SelectGender"
import { httpService } from "../../core/httpService"
import { AxiosError} from "axios"

type RegisterFormValue = {
  fullName: string,
  username: string,
  password: string,
  confirmPassword: string,
  gender: "male" | "female"
}

const Register: FC = (): JSX.Element => {
  const { register, watch, handleSubmit, formState: { errors } } = useForm<RegisterFormValue>()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShoConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const genders = ["male", "female"]

  const onSubmit: SubmitHandler<RegisterFormValue> = async (data) => {
    const registerPromise = httpService.post("/auth/register", data);
    toast.promise(
      registerPromise,
      {
        loading: "Creating your account...",
        success: (response) => {
          if (response.status === 201) {
            setTimeout(() => {
              navigate("/login", { replace: true })
            }, 3000);
            return "Registration successful! Redirecting to login page..."
          }
          return "Register was successful"
        },
        error: (error) => {
          if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error;

            switch (status) {
              case 400:
                return errorMessage;
              case 500:
                return errorMessage;
              default:
                return "Something went wrong please try again later";
            }
          }
          return "Somethin went wrong"
        }
      }
    );
  }

  return (
    <div className="bg-gray-400/10 backdrop-blur-lg p-6 flex flex-col min-w-96 items-center justify-center rounded-lg shadow-lg">
      <h1 className="text-white text-3xl font-semibold mb-5">Register <span className="text-purple-600">Chat App</span></h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mt-5 flex flex-col">

        {/* FULLNAME_INPUT */}
        <AuthInputs
          label="FullName"
          register={register("fullName", {
            required: "Full name is required",
            minLength: {
              value: 3,
              message: "Full name must be at least 3 characters"
            }
          })}
          error={errors.fullName}
          type="text"
          placeholder="Enter your full name"
        />

        {/* USERNAME_INPUT */}
        <AuthInputs
          label="Username"
          register={register("username", {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters"
            }
          })}
          error={errors.username}
          type="text"
          placeholder="Enter your username"
        />

        {/* PASSWORD_INPUT */}
        <AuthInputs
          label="Password"
          register={register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters"
            }
          })}
          error={errors.password}
          type="password"
          placeholder="Enter your password"
          isPassword
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
        />

        {/* CONFIRM_PASSWORD_INPUT */}
        <AuthInputs
          label="Confirm Password"
          register={register("confirmPassword", {
            required: "Confirm password is required",
            validate: (value) => {
              if (watch("password") !== value) {
                return "Password and confirm password do not match"
              }
            }
          })}
          error={errors.confirmPassword}
          type="password"
          placeholder="Confirm your password"
          isPassword
          showPassword={showConfirmPassword}
          toggleShowPassword={() => setShoConfirmPassword(!showConfirmPassword)}
        />

        {/* SELECT_GENDER_RADIO */}
        <SelectGender
          register={register("gender", {
            required: "Please select your gender"
          })}
          genders={genders}
          error={errors.gender}
        />

        <div className="mb-4">
          <Link
            to={"/login"}
            className="text-sm hover:underline hover:text-purple-600 transition-all duration-200 inline-block ml-1"
          >Already have an account?</Link>
        </div>

        <button type="submit" className="btn btn-sm border-0 bg-purple-600 hover:bg-gray-400/0 hover:text-purple-600 hover:outline hover:outline-purple-600">Register</button>
      </form>
    </div>
  )
}

export default Register