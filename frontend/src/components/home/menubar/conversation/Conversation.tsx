import type { FC, ReactNode } from "react"
import useConversation from "../../../../store/useConversation"
import { useTheme } from "../../../../hooks/useTheme"
import { Hash, Lock, Users } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { ConversationType, GroupType } from "../../../../types/conversations"
import { useSocketContex } from "../../../../context/socket/socketContext"

type ConversationProps = {
  conversation?: ConversationType,
  group?: GroupType,
  emoji: ReactNode,
  lastIndex: boolean,
  handleInvite?: () => void
  handleConversation?: () => void
}

const Conversation: FC<ConversationProps> = ({ conversation, emoji, group, lastIndex, handleInvite, handleConversation }) => {
  const { selectedConversation, selectedGroup } = useConversation();
  const {onlineUsers} = useSocketContex();
  const { classes } = useTheme();
  const { t } = useTranslation();

  const isSelected = conversation ? selectedConversation?._id === conversation._id : selectedGroup?._id === group?._id;
  const isOnline = onlineUsers.includes(conversation?._id as string) 

  const handleClick = () => {
    if (handleConversation) {
      handleConversation();
    }
    if (handleInvite) {
      handleInvite();
    }
  }

  const displayName = conversation?.username || group?.groupName || "";
  const profilePicture = conversation?.profilePicture || group?.groupImage;
  const avatarClassName = `${group? "avatar": isOnline? "avatar avatar-online": "avatar"}`

  return (
    <>
      <div
        onClick={handleClick}
        className={`flex gap-2 items-center justify-center ${classes.primary.hover.bg} rounded px-2 py-1 cursor-pointer ${isSelected ? `${classes.primary.bg}` : ""}`}
      >
        <div className={avatarClassName}>
          <div className="w-12 rounded-full">
            <img src={profilePicture} alt={displayName} />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              {group && (
                <div className="flex items-center gap-1">
                  {group.groupType === "channel" ? (
                    <Hash size={14} className="text-gray-400" />
                  ) : (
                    <Users size={14} className="text-gray-400" />
                  )}
                  {group.isPrivate && (
                    <Lock size={12} className="text-yellow-400" />
                  )}
                </div>
              )}
              <p className="font-bold text-gray-200 truncate text-sm">
                {displayName}
              </p>
            </div>
            <span className="text-xl">{emoji}</span>
          </div>
          {group && group.members && Array.isArray(group.members) && (
            <p className="text-xs text-gray-400">
              {group.members.length} {t("home.members")}
            </p>
          )}
        </div>
      </div>
      {
        (!lastIndex) && <div className="border-b-1 border-gray-500"></div>
      }
    </>
  )

}

export default Conversation;