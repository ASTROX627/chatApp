import { Copy, Crown, Hash, MessageSquareText, Shield, User, Users } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import useConversation from "../../../store/useConversation"
import type { ConversationType, GroupType } from "../../../types/conversations";
import Conversation from "../menubar/conversation/Conversation";
import { useAppContext } from "../../../context/app/appContext";
import { useCallback, useState, type FC } from "react";
import toast from "react-hot-toast";
import { useGetUserProfile } from "../../../hooks/useGetUserProfile";

const ProfileView: FC = () => {
  const { selectedConversation, setSelectedConversation, selectedGroup, setSelectedGroup } = useConversation();
  const { classes } = useTheme();
  const { setShowMessageContainer, setShowProfile } = useAppContext();
  const { getUserProfile } = useGetUserProfile();
  const [copiedText, setCopiedText] = useState("");

  const commonGroups = selectedConversation?.commonGroups || [];
  const hasCommonGroups = commonGroups.length > 0;

  const handleConversaionClick = useCallback((user: ConversationType) => {
    setSelectedConversation(user);
    setShowMessageContainer()
  }, [setSelectedConversation, setShowMessageContainer]);


  const handleCommonGroupClick = useCallback((group: GroupType) => {
    setSelectedGroup(group);
    setShowMessageContainer();
  }, [setSelectedGroup, setShowMessageContainer]);

  const handelUserClick = async (userId: string) => {
    await getUserProfile(userId);
    setShowProfile()
  }


  const getUserRole = (userId: string) => {
    if (selectedGroup?.owner._id === userId) {
      return { icon: Crown, text: "Owner" }
    }
    if (selectedGroup?.admins.some(admin => admin._id === userId)) {
      return { icon: Shield, text: "Admin" }
    }
    return { icon: User, text: "Member" }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      toast.success("URL Copied!");
      setTimeout(() => setCopiedText(""), 3000);
    } catch (error) {
      toast.error("Copied failed!");
      console.log(error);

    }
  }

  const renderUserItem = (user: { _id: string, username: string, profilePicture: string }, userId?: string) => {
    const actualUserId = userId || user._id;
    const role = getUserRole(actualUserId);
    const RoleIcon = role.icon

    return (
      <div onClick={() => handelUserClick(actualUserId)} key={actualUserId} className={`border-b-1 border-gray-500 py-2 ${classes.primary.hover.bg} transition-colors duration-100 cursor-pointer`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between gap-2 ms-1">
            <img src={user.profilePicture} alt="user profile picture" className="w-12" />
            <div className="flex flex-col">
              <p className="text-slate-800">{user.username}</p>
              <p>{role.text}</p>
            </div>
          </div>
          <RoleIcon size={16} className="me-1" />
        </div>
      </div>
    )
  }


  return (
    <div className={`w-full flex flex-col ${classes.secondary.bg} h-full overflow-auto scrollbar scrollbar-track-neutral-700 scrollbar-thumb-neutral-900 hover:scrollbar-thumb-neutral-800 relative`}>
      <div className="w-full my-2 border-b-2 border-gray-600">
        <img className="w-1/3 mx-auto my-2" src={selectedConversation?.profilePicture || selectedGroup?.groupImage} alt="profile picture" />
      </div>
      {
        selectedConversation && (
          <div onClick={() => handleConversaionClick(selectedConversation)} className={`absolute ${classes.primary.bg} rounded-full p-3 ltr:right-2  rtl:left-2 bottom-91 cursor-pointer`}>
            <MessageSquareText size={36} />
          </div>
        )
      }
      {
        selectedGroup && (
          <div onClick={() => handleCommonGroupClick(selectedGroup)} className={`absolute ${classes.primary.bg} rounded-full p-3 ltr:right-2  rtl:left-2 bottom-91 cursor-pointer`}>
            <MessageSquareText size={36} />
          </div>
        )
      }
      <div className="m-2">
        <h3 className="font-semibold text-2xl text-slate-800 mb-4">Info</h3>
        {
          selectedConversation && selectedConversation.fullName && (
            <div className="border-b-1 border-gray-600 mb-2">
              <h4 className="text-lg text-slate-500">Full name</h4>
              <h5 className="text-lg text-slate-700">{selectedConversation.fullName}</h5>
            </div>
          )
        }
        {
          selectedConversation && selectedConversation.username && (
            <div className="border-b-1 border-gray-600 mb-2">
              <h4 className="text-lg text-slate-500">Username</h4>
              <h5 className="text-lg text-slate-700">{selectedConversation.username}</h5>
            </div>
          )
        }
        {
          selectedConversation && hasCommonGroups && (
            <div className="border-b-1 border-gray-600 mb-2">
              <h4 className="text-lg text-slate-500">Commmon groups</h4>
              {commonGroups.map((commonGroup: GroupType, index) => (
                <Conversation
                  key={commonGroup._id}
                  emoji={commonGroup.emoji}
                  lastIndex={index === commonGroups.length - 1}
                  group={commonGroup}
                  handleConversation={() => handleCommonGroupClick(commonGroup)}
                />
              ))}
            </div>
          )
        }
        {
          selectedGroup && selectedGroup.groupName && (
            <div className="border-b-1 border-gray-600 mb-2">
              <h4 className="text-lg text-slate-500">{selectedGroup.groupType === "channel" ? "Channel" : "Group"} name</h4>
              <h5 className="text-lg text-slate-700 flex items-center gap-2">{selectedGroup.groupType === "channel" ? <Hash size={20} /> : <Users size={20} />}{selectedGroup.groupName}</h5>
            </div>
          )
        }
        {
          selectedGroup && !selectedGroup.isPrivate && selectedGroup.inviteUrl && (
            <div className="border-b-1 border-gray-600 mb-2">
              <h4 className="text-lg text-slate-500">Invite URL</h4>
              <div className="flex items-center justify-between">
                <h5 className="text-sm text-slate-700 flex items-center gap-2">{selectedGroup.inviteUrl}</h5>
                <button
                  onClick={() => selectedGroup.inviteUrl && copyToClipboard(selectedGroup.inviteUrl)}
                  className={`${classes.primary.bg} p-1 rounded-md mb-1 cursor-pointer`} >
                  <Copy size={20} />
                </button>
              </div>
            </div>
          )
        }
        {
          selectedGroup && selectedGroup.members && (
            <div className="border-b-1 border-gray-500 mb-2">
              <h4 className="text-lg text-slate-500">Members ({selectedGroup.members.length})</h4>
              {selectedGroup && selectedGroup.groupType === "group" && (
                <>
                  {selectedGroup.members.map(member => renderUserItem(member.user, member.user._id))}
                  {selectedGroup.admins.filter(admin => admin._id !== selectedGroup.owner._id).map(admin => renderUserItem(admin))}
                </>
              )}
            </div>
          )
        }
      </div>
    </div>
  )
}

export default ProfileView