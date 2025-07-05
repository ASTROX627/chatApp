import { RouterProvider } from "react-router-dom"
import router from "./router/router"
import { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <div className="flex h-screen mx-auto items-center justify-center">
      <RouterProvider router={router}/>
      <Toaster
        position="bottom-left"
        reverseOrder={true}
      />
    </div>
  )
}

export default App