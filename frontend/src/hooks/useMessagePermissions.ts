import useConversation from "../store/useConversation"

export const useMessagePermissions = () => {
  const { selectedConversation, selectedGroup } = useConversation();
  const isGroupChat = !!selectedGroup;

  const canSendMessage = () => {
    if (!isGroupChat) return true;
    if (!selectedGroup) return false;

    if (selectedGroup.groupType === "channel") {
      return selectedGroup.admins.some(admin => admin._id === selectedConversation?._id);
    }

    return true
  }

  return { canSendMessage: canSendMessage(), isGroupChat, selectedGroup }
}