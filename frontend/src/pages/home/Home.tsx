import Menubar from "../../components/home/menubar/Menubar"
import MessageContainer from "../../components/home/messages/MessageContainer"
import Sidebar from "../../components/home/sidebar/Sidebar"
import { useAppContext } from "../../context/app/appContext"

const Home = () => {
  const {showSidebar, setShowSidebar} = useAppContext();
  return (
    <div className="bg-gray-400/10 flex items-center justify-start backdrop-blur-lg rounded-lg shadowlg h-[90vh] w-[90vw] relative">
      <Sidebar/>
      {
        showSidebar && (
          <div
            onClick={setShowSidebar} 
            className="fixed inset-0 bg-black/20 z-20"/>
        )
      }
      <Menubar/>
      <MessageContainer/>
    </div>
  )
}

export default Home