import { useEffect, useState, type FC } from "react"
import { useAuthContext } from "../../../context/auth/authContext";
import useConversation from "../../../store/useConversation";
import { twMerge } from "tailwind-merge";
import { useTheme } from "../../../hooks/useTheme";
import InviteModal from "../../modal/InviteModal";
import { useLeaveGroup } from "../../../hooks/useLeaveGroup";

const OptionsDropdown: FC = () => {
  const { authUser } = useAuthContext();
  const { selectedGroup } = useConversation();
  const { classes } = useTheme();
  const {leavegroup} = useLeaveGroup();

  const [canSendInvite, setCanSendInvite] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isOwner = selectedGroup?.owner?._id === authUser?._id;
  const isAdmin = selectedGroup?.admins?.some(admin => admin._id === authUser?._id);

  const handleLeaveGroup = async() => {
    if(selectedGroup){
      await leavegroup(selectedGroup._id);
    }
  }

  useEffect(() => {
    if (isAdmin || isOwner) {
      setCanSendInvite(true)
    } else {
      setCanSendInvite(false)
    }
  }, [isAdmin, isOwner])

  return (
    <>
      <ul className={twMerge(classes.primary.bg, "cursor-pointer")}>
        {canSendInvite && (
          <li className={twMerge(classes.secondary.hover.bg, "p-2 transition-colors duration-200")}>
            <button
              className="cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              Send invite
            </button>
          </li>
        )}
        <li className={twMerge("p-2 transition-colors duration-200", classes.secondary.hover.bg)}>
          <button 
            className="cursor-pointer"
            onClick={handleLeaveGroup}
          >
            Leave group
          </button>
        </li>
      </ul>
      <InviteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  )
}

export default OptionsDropdown
