import { useState, type FC } from "react"
import { useAppContext } from "../../../../context/app/appContext"
import Conversations from "./Conversations";
import SearchInput from "./SearchInput";

const ConversationsMenu: FC = () => {
  const { showChatMenu } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  return (
    showChatMenu && (
      <div className="h-full overflow-auto scrollbar scrollbar-track-neutral-700 scrollbar-thumb-neutral-900 hover:scrollbar-thumb-neutral-800">
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <Conversations
          searchTerm={searchTerm}
        />
      </div>
    )
  )
}

export default ConversationsMenu;