import { useAuthContext } from "../context/auth/authContext";
import useConversation from "../store/useConversation"

export const useMessagePermissions = () => {
  const { selectedGroup } = useConversation();
  const {authUser} = useAuthContext();
  const isGroupChat = !!selectedGroup;

  const canSendMessage = () => {
    if (!isGroupChat) return true;
    if (!selectedGroup) return false;

    if (selectedGroup.groupType === "channel") {
      return selectedGroup.admins.some(admin => admin._id === authUser?._id);
    }

    return true
  }

  return { canSendMessage: canSendMessage(), isGroupChat, selectedGroup }
}