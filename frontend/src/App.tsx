import { RouterProvider } from "react-router-dom"
import router from "./router/router"
import { Toaster } from "react-hot-toast"
import { useTheme } from "./hooks/useTheme"
import "../src/core/i18n"

const App = () => {
  const {styles} = useTheme()
  return (
    <div style={styles} className="flex h-screen mx-auto items-center justify-center">
      <RouterProvider router={router}/>
      <Toaster
        position="bottom-left"
        reverseOrder={true}
        toastOptions={{duration: 3000}}
      />
    </div>
  )
}

export default App