import { useCallback, type FC } from "react";
import { useAppContext } from "../../../../context/app/appContext";
import Conversation from "./Conversation";
import { useTranslation } from "react-i18next";
import { useFilteredConversation } from "../../../../hooks/useFilteredConversation";
import type { AllConversations, ConversationType, GroupType } from "../../../../types/conversations";
import useConversation from "../../../../store/useConversation";


type ConversationsProps = {
  searchTerm: string,
  selectedCategory: string
}

const Conversations: FC<ConversationsProps> = ({ searchTerm, selectedCategory }) => {
  const { setSelectedConversation, setSelectedGroup } = useConversation();
  const { setShowMessageContainer } = useAppContext();
  const { filteredConversations, isLoading, hasSearchTerm, isEmpty, hasNoConversations } = useFilteredConversation({ searchTerm, selectedCategory });
  const { t } = useTranslation();

  const handleMessageContainerClick = useCallback(() => {
    setShowMessageContainer();
  }, [setShowMessageContainer]);

  const handleConversationSelection = useCallback((conversation: ConversationType | GroupType | undefined) => {
    if (conversation) {
      if ("username" in conversation) {
        setSelectedConversation(conversation as ConversationType)
      } else {
        setSelectedGroup(conversation as GroupType)
      }
    }
  }, [setSelectedConversation, setSelectedGroup])

  return (
    <div onClick={handleMessageContainerClick} className="flex flex-col p-5">
      {filteredConversations.map((conversation: AllConversations, index) => (
        <Conversation
          key={`${conversation.type}-${conversation._id}`}
          conversation={conversation.type === "user" ? conversation as ConversationType : undefined}
          group={conversation.type === "group" ? conversation as GroupType : undefined}
          emoji={conversation.emoji}
          lastIndex={index === filteredConversations.length - 1}
          handleConversation={() => handleConversationSelection(conversation.type === "user" ? conversation as ConversationType : conversation as GroupType)}
        />
      ))}

      {isLoading && (
        <div className="flex justify-center py-4">
          <span className="loading loading-spinner mx-auto"></span>
        </div>
      )}

      {!isLoading && isEmpty && hasSearchTerm && (
        <div className="text-center py-8 text-gray-400">
          <p>{t("home.notFound")}</p>
        </div>
      )}

      {!isLoading && hasNoConversations && !hasSearchTerm && (
        <div className="text-center py-8 text-gray-400">
          <p>{t("home.notConversations")}</p>
        </div>
      )}
    </div>
  );
};

export default Conversations;