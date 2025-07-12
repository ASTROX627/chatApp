import Menubar from "../../components/home/menubar/Menubar"
import MessageContainer from "../../components/home/messages/MessageContainer"
import Sidebar from "../../components/home/sidebar/Sidebar"

const Home = () => {
  return (
    <div className="bg-gray-400/10 flex items-center justify-center backdrop-blur-lg rounded-lg shadowlg h-[80vh]">
      <Sidebar/>
      <Menubar/>
      <MessageContainer/>
    </div>
  )
}

export default Home
