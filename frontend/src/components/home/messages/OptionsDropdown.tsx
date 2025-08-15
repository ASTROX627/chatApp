import { useEffect, useState, type FC } from "react"
import { useAuthContext } from "../../../context/auth/authContext";
import useConversation from "../../../store/useConversation";
import { twMerge } from "tailwind-merge";
import { useTheme } from "../../../hooks/useTheme";
import InviteModal from "../../modal/InviteModal";
import { useLeaveGroup } from "../../../hooks/useLeaveGroup";
import { LogOut, UserCheck, UserRoundPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import UserManagementModal from "../../modal/UserManagementModal";

const OptionsDropdown: FC = () => {
  const { authUser } = useAuthContext();
  const { selectedGroup } = useConversation();
  const { classes } = useTheme();
  const { leavegroup } = useLeaveGroup();
  const { t } = useTranslation();

  const [management, setManagement] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showUserManagementModal, setShowUserManagementModal] = useState(false);

  const isOwner = selectedGroup?.owner?._id === authUser?._id;
  const isAdmin = selectedGroup?.admins?.some(admin => admin._id === authUser?._id);

  const handleLeaveGroup = async () => {
    if (selectedGroup) {
      await leavegroup(selectedGroup._id);
    }
  }

  useEffect(() => {
    if (isAdmin || isOwner) {
      setManagement(true)
    } else {
      setManagement(false)
    }
  }, [isAdmin, isOwner])

const manageMentItems = [
    {
      label: t("home.sendInvite"),
      icon: <UserRoundPlus size={20} />,
      onclick: () => setShowInviteModal(true),
    },
    {
      label: t("home.manageMembers"),
      icon: <UserCheck size={20} />,
      onclick: () => setShowUserManagementModal(true),
    },
  ];

  return (
    <>
      <ul className={twMerge(classes.primary.bg, "cursor-pointer rounded-md")}>
        {management && (
          manageMentItems.map((manageMentItem, index) => (
            <li
              className={twMerge("p-2 transition-colors duration-200", classes.secondary.hover.bg)}
              key={index}
            >
              <button
                className="cursor-pointer flex items-center justify-center gap-2 text-sm"
                onClick={manageMentItem.onclick}
              >
                {manageMentItem.icon} {manageMentItem.label}
              </button>
            </li>
          ))
        )}
        <li className={twMerge("p-2 transition-colors duration-200", classes.secondary.hover.bg)}>
          <button
            className="cursor-pointer flex items-center justify-center gap-2 text-sm"
            onClick={handleLeaveGroup}
          >
            <LogOut size={20} /> Leave Group
          </button>
        </li>
      </ul>
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
      <UserManagementModal
        isOpen={showUserManagementModal}
        onClose={() => setShowUserManagementModal(false)}
      />
    </>
  )
}

export default OptionsDropdown
