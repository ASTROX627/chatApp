import { Hash, Lock, UserPlus, Users } from "lucide-react"
import type { FC } from "react"
import type { InviteLinkData } from "../../../types/conversations"
import useConversation from "../../../store/useConversation"
import { useGetPrivateGroup } from "../../../hooks/useGetPrivateGroup"
import { useAppContext } from "../../../context/app/appContext"
import { useTranslation } from "react-i18next"

type InviteLinkMessageProps = {
  url: string,
  group: InviteLinkData
}

const InviteLinkMessage: FC<InviteLinkMessageProps> = ({ url, group }) => {
  const { setSelectedGroup, setSelectedConversation } = useConversation();
  const { setShowMessageContainer } = useAppContext();
  const { getPrivateGroup, loading } = useGetPrivateGroup();
  const {t} = useTranslation();

  const inviteCode = url.split("/").pop();
  const handleInviteLinkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inviteCode) {
      return;
    }

    const groupData = await getPrivateGroup(inviteCode);
    if (groupData) {
      setSelectedConversation(null);
      setSelectedGroup(groupData);
      setShowMessageContainer();
    }
  };

  return (
    <div
      onClick={handleInviteLinkClick}
      className="bg-gray-600 rounded-lg max-w-xs cursor-pointer hover:bg-gray-500 transition-colors p-3 mx-auto"
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <span className="loading loading-spinner text-blue-400 shrink-0"></span>
          <span className="text-xs text-gray-300">{t("home.loading")}</span>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {group.groupType === "channel" ? (
                <Hash size={14} className="text-gray-400" />
              ) : (
                <Users size={14} className="text-gray-400" />
              )}
              <Lock size={12} className="text-yellow-400" />
            </div>
            <span className="text-xs text-gray-300 mt-1">
              {group.groupType === "channel" ? t("home.groupTypes.channel") : t("home.groupTypes.group")} {t("home.private")}
            </span>
          </div>
          <div className="flex items-center gap-3 mx-auto">
            <div className="min-w-0 flex flex-col">
              <p className="text-sm font-medium text-white truncate">
                {group.groupName}
              </p>
              <p className="text-xs text-gray-400">
                {t("home.clickToJoin")}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-500">
            <UserPlus size={16} className="text-blue-400" />
            <span className="text-sm text-blue-400 font-medium mt-1">
              {t("home.watchAndJoin")}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default InviteLinkMessage