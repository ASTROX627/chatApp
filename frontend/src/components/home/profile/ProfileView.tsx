import { MessageSquareText } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import useConversation from "../../../store/useConversation"
import type { GroupType } from "../../../types/conversations";
import Group from "../menubar/conversation/Group";

const ProfileView = () => {
  const { selectedConversation, selectedGroup } = useConversation();
  const { classes } = useTheme();

  const commonGroups = selectedConversation?.commonGroups || [];
  const hasCommonGroups = commonGroups.length > 0;


  return (
    <div className={`w-full flex flex-col ${classes.secondary.bg} h-full overflow-auto scrollbar scrollbar-track-neutral-700 scrollbar-thumb-neutral-900 hover:scrollbar-thumb-neutral-800`}>
      <div className="w-full my-2 border-b-2 border-gray-600 relative">
        <img className="w-1/3 mx-auto my-2" src={selectedConversation?.profilePicture || selectedGroup?.groupImage} alt="profile picture" />
      </div>
      <div className={`absolute ${classes.primary.bg} rounded-full p-3 ltr:right-2  rtl:left-2 bottom-91 cursor-pointer`}>
        <MessageSquareText size={36} className="" />
      </div>
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
              {commonGroups.map((commonGroup: GroupType) => (
                <Group
                  key={commonGroup._id}
                  group={commonGroup}
                  emoji={commonGroup.emoji}
                />
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}

export default ProfileView