import type { FC, JSX } from "react"
import Menubar from "../../components/home/menubar/Menubar"
import MessageContainer from "../../components/home/messages/MessageContainer"
import Sidebar from "../../components/home/sidebar/Sidebar"
import { useAppContext } from "../../context/app/appContext"

const Home:FC = ():JSX.Element => {
  const { showSidebar, setShowSidebar } = useAppContext();
  return (
    <div className="bg-gray-400/10 backdrop-blur-lg rounded-lg shadowlg h-[90vh] w-[90vw] relative lg:grid lg:grid-cols-[auto_1fr_1fr] lg:gap-0">
      <Sidebar />
      {showSidebar && !window.matchMedia('(min-width: 1024px)').matches && (
        <div onClick={setShowSidebar} className="fixed inset-0 bg-black/20 z-20" />
      )}
      <Menubar />
      <MessageContainer />
    </div>
  )
}

export default Home