import { useAuthContext } from "../context/auth/authContext";
import useConversation from "../store/useConversation"

export const useMessagePermissions = () => {
  const { selectedGroup } = useConversation();
  const {authUser} = useAuthContext();
  const isGroupChat = !!selectedGroup;
  const isChannel = selectedGroup?.groupType === "channel";
  const isAdmin = selectedGroup?.admins.some(admin => admin._id === authUser?._id);
  const isMember = selectedGroup?.members.some(member => member.user._id === authUser?._id)

  const canSendMessage = () => {
    if (!isGroupChat) return true;
    if (!selectedGroup) return false;
    if(!isChannel && !isMember) return false;
    if(isChannel && !isAdmin) return false;
    return true
  }

  return { canSendMessage: canSendMessage(), isGroupChat, selectedGroup, isAdmin, isMember, isChannel }
}