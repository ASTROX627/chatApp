import { useState, type FC, type JSX } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import AuthInputs from "../../components/auth/AuthInputs"
import { httpService } from "../../core/httpService"
import toast from "react-hot-toast"
import { AxiosError } from "axios"

type LoginFormValue = {
  username: string,
  password: string
}

const Login: FC = (): JSX.Element => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValue>();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormValue> = async (data) => {
    const loginPromise = httpService.post("/login", data);
    toast.promise(
      loginPromise,
      {
        loading: "Signing in to your account...",
        success: (response) => {
          if (response.status === 200) {
            setTimeout(() => {
              navigate("/", { replace: true })
            }, 3000);
            return "Signing successful! Redirecting to home page..."
          }
          return "Signing was successful"
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
          return "Something went wrong"
        }
      }
    );
  }

  return (
    <div className="bg-gray-400/10 backdrop-blur-lg p-6 flex flex-col min-w-96 items-center justify-center rounded-lg shadow-lg">
      <h1 className="text-white text-3xl font-semibold mb-5">Login <span className="text-purple-600">Chat App</span></h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mt-5 flex flex-col">

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
              value: 3,
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

        <div className="mb-4">
          <Link
            to={"/register"}
            className="text-sm hover:underline hover:text-purple-600 transition-all duration-200 inline-block ml-1"
          >{"Don't"} have an account?</Link>
        </div>

        <button type="submit" className="btn btn-sm border-0 bg-purple-600 hover:bg-gray-400/0 hover:text-purple-600 hover:outline hover:outline-purple-600">Login</button>
      </form>
    </div>
  )
}

export default Login