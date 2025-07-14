import { useMemo, type FC } from "react";
import useGetConversations from "../../../../hooks/useGetConversations"
import type { ConversationType } from "../../../../store/useConversation";
import { getRandomEmoji } from "../../../../utils/emojis";
import Conversation from "./Conversation";
import { useAppContext } from "../../../../context/app/appContext";

type ConversationsProps = {
  searchTerm: string
}

const Conversations: FC<ConversationsProps> = ({ searchTerm }) => {
  const { loading, conversations } = useGetConversations();
  const {setShowMessageContainer} = useAppContext();

  const converSationsWithEmojis = useMemo(() => {
    return conversations.map((conversation: ConversationType) => ({
      ...conversation,
      emoji: getRandomEmoji()
    }))
  }, [conversations])

  const filteredConversations = converSationsWithEmojis.filter((conversations: ConversationType) => (conversations.username.toLowerCase().includes(searchTerm.toLowerCase())))

  return (
    <div onClick={setShowMessageContainer} className="flex flex-col p-5">
      {
        filteredConversations.map((conversation: ConversationType, index) => (
          <Conversation
            key={conversation._id}
            conversation={conversation}
            emoji={conversation.emoji}
            lastIndex={index === conversations.length - 1}
          />
        ))
      }
      {loading ? <span className="loading loading-spinner mx-auto"></span> : null}
    </div>
  )
}

export default Conversations;
