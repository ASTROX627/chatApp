import { useState, type FC, type JSX } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Link } from "react-router-dom"
import AuthInputs from "../../components/auth/AuthInputs"

type LoginFormValue = {
  username: string,
  password: string
}

const Login: FC = (): JSX.Element => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValue>();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<LoginFormValue> = (data) => {
    console.log(data);
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
            required: true,
            minLength: 3
          })}
          error={errors.username}
          type="text"
          placeholder="Enter your username"
        />

        {/* PASSWORD_INPUT */}
        <AuthInputs
          label="Password"
          register={register("password", {
            required: true,
            minLength: 6
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