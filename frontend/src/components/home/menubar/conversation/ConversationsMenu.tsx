import { useState, type FC } from "react"
import { useAppContext } from "../../../../context/app/appContext"
import ConversationSearch from "./ConversationSearch";
import Conversations from "./Conversations";
import { Menu } from "lucide-react";


const ConversationsMenu: FC = () => {
  const { showChatMenu, setShowSidebar } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  return (
    showChatMenu && (
      <div className="h-full overflow-auto scrollbar scrollbar-track-neutral-700 scrollbar-thumb-neutral-900 hover:scrollbar-thumb-neutral-800">
        <div className="flex items-center justify-between px-5">
          <button
            onClick={setShowSidebar}
          >
            <Menu size={32} />
          </button>
          <ConversationSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        <Conversations
          searchTerm={searchTerm}
        />
      </div>
    )
  )
}

export default ConversationsMenu;