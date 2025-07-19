import type { FC, ReactNode } from "react"
import type { ConversationType, GroupType } from "../../../../store/useConversation"
import useConversation from "../../../../store/useConversation"
import { useTheme } from "../../../../hooks/useTheme"
import { Hash, Lock, Users } from "lucide-react"
import { useTranslation } from "react-i18next"

type ConversationProps = {
  conversation?: ConversationType,
  group?: GroupType
  emoji: ReactNode,
  lastIndex: boolean
}

const Conversation: FC<ConversationProps> = ({ conversation, emoji, group, lastIndex }) => {
  const { selectedConversation, setSelectedConversation, selectedGroup, setSelectedGroup } = useConversation();
  const { classes } = useTheme();
  const { t } = useTranslation();

  const isSelected = conversation ? selectedConversation?._id === conversation._id : selectedGroup?._id === group?._id;

  const handleClick = () => {
    if (conversation) {
      setSelectedConversation(conversation)
    } else if (group) {
      setSelectedGroup(group)
    }
  }

  const displayName = conversation?.username || group?.groupName || "";
  const profilePicture = conversation?.profilePicture || group?.groupImage;

  console.log("profile:", profilePicture);

  return (
    <>
      <div
        onClick={handleClick}
        className={`flex gap-2 items-center justify-center ${classes.primary.hover.bg} rounded px-2 py-1 cursor-pointer ${isSelected ? `${classes.primary.bg}` : ""}`}
      >
        <div className="avatar avatar-online">
          <div className="w-12 rounded-full">
            <img src={`${profilePicture}?v=${Date.now()}`} alt={displayName} />
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
          {group && (
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