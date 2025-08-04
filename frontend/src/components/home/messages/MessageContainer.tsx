import Messages from "./Messages"
import NoChatSelected from "./NoChatSelected";
import { useAppContext } from "../../../context/app/appContext";
import { ArrowLeft, ArrowRight, Hash, Lock, UserPlus, Users } from "lucide-react";
import { useEffect, useState, type FC, type JSX } from "react";
import useConversation from "../../../store/useConversation";
import { useTranslation } from "react-i18next";
import MessageInput from "./MessageInput";
import { useTheme } from "../../../hooks/useTheme";
import { useAuthContext } from "../../../context/auth/authContext";
import InviteModal from "../../modal/InviteModal";
import { useGetUserProfile } from "../../../hooks/useGetUserProfile";
import { useGetGroupProfile } from "../../../hooks/useGetGroupProfile";

const MessageContainer: FC = (): JSX.Element => {
  const { selectedConversation, selectedGroup } = useConversation();
  const { showMessageContainer, setShowChatMenu, language, setShowProfile } = useAppContext();
  const {getUserProfile} = useGetUserProfile();
  const {getGroupProfile} = useGetGroupProfile();
  const { authUser } = useAuthContext();
  const { t } = useTranslation();
  const { classes } = useTheme();

  const [canSendInvite, setCanSendInvite] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const activeChat = selectedConversation || selectedGroup;
  const isOwner = selectedGroup?.owner?._id === authUser?._id;
  const isAdmin = selectedGroup?.admins?.some(admin => admin._id === authUser?._id);


  useEffect(() => {
    if (isAdmin || isOwner) {
      setCanSendInvite(true)
    } else {
      setCanSendInvite(false)
    }
  }, [isAdmin, isOwner])

  const handleAvatarClick = async () => {
    if(selectedConversation){
      await getUserProfile(selectedConversation._id)
      setShowProfile();
    } else if (selectedGroup){
      await getGroupProfile(selectedGroup._id)
      setShowProfile()
    }
  
  }

  return (
    <div className={`h-full overflow-auto scrollbar scrollbar-track-neutral-700 scrollbar-thumb-neutral-900 hover:scrollbar-thumb-neutral-800 border-gray-500 rounded-e-md
      ${showMessageContainer ? "w-full" : "w-0"}
      lg:w-full lg:block flex`}>
      {!activeChat ? (
        <NoChatSelected />
      ) : (
        <div className="flex flex-col justify-between h-full">
          <nav className="bg-gray-600 p-4 mb-2 flex items-center gap-2 z-10 w-full sticky top-0 justify-between">
            <div className="flex justify-between items-center gap-2">
              <button
                onClick={setShowChatMenu}
                className="cursor-pointer lg:hidden"
              >
                {language === "en" ? <ArrowLeft size={32} /> : <ArrowRight size={32} />}
              </button>
              <div className="avatar avatar-online cursor-pointer" onClick={handleAvatarClick}>
                <div className="w-12 rounded-full">
                  <img
                    src={selectedConversation?.profilePicture || selectedGroup?.groupImage}
                    alt="chat image"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedGroup && (
                  <div className="flex items-center gap-1">
                    {selectedGroup.groupType === "channel" ? (
                      <Hash size={16} className="text-gray-400" />
                    ) : (
                      <Users size={16} className="text-gray-400" />
                    )}
                    {selectedGroup.isPrivate && (
                      <Lock size={14} className="text-yellow-400" />
                    )}
                  </div>
                )}
                <span className="text-gray-200 font-bold">
                  {selectedConversation?.username || selectedGroup?.groupName}
                </span>
                {selectedGroup && (
                  <span className="text-sm text-gray-600">
                    ({selectedGroup.members.length} {t("home.members")})
                  </span>
                )}
              </div>

            </div>
            {
              canSendInvite && (
                <button 
                  onClick={() => setShowModal(true)}
                  className={`${classes.primary.bg} size-12 rounded-full cursor-pointer`}>
                  <UserPlus className="mx-auto" />
                </button>
              )
            }
          </nav>
          <Messages />
          <MessageInput />
        </div>
      )}
      <InviteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  )
}

export default MessageContainer