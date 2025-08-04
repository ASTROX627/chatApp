import { useAuthContext } from "../context/auth/authContext";
import useConversation from "../store/useConversation"

export const useMessagePermissions = () => {
  const { selectedGroup } = useConversation();
  const {authUser} = useAuthContext();
  const isGroupChat = !!selectedGroup;
  const isChannel = selectedGroup?.groupType === "channel";
  const isAdmin = selectedGroup?.admins.some(admin => admin._id === authUser?._id || admin.toString() === authUser?._id) || false;
  const isOwner = selectedGroup?.owner._id === authUser?._id || selectedGroup?.owner.toString() === authUser?._id
  const isMember = selectedGroup?.members.some(member => {
    if(member.user && typeof member.user === "object"){
      return member.user._id === authUser?._id
    }
    if(typeof member.user === "string"){
      return member.user === authUser?._id
    }

    if(typeof member === 'string'){
      return member === authUser?._id
    }
    return false
  }) || isAdmin || isOwner;

  const canSendMessage = () => {
    if (!isGroupChat) return true;
    if (!selectedGroup) return false;
    if(!isMember) return false;
    if(isChannel && !isAdmin && !isOwner) return false;
    return true
  }

  return { canSendMessage: canSendMessage(), isGroupChat, selectedGroup, isAdmin, isMember, isChannel, isOwner }
}