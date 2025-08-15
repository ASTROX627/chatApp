import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { User, UserCheck, UserRoundX, UserX, X } from "lucide-react"
import { Fragment, type FC } from "react"
import { useTranslation } from "react-i18next"
import useConversation from "../../store/useConversation"
import { useAuthContext } from "../../context/auth/authContext"
import { usePromoteUser } from "../../hooks/usePromoteUser"
import { useDemoteUser } from "../../hooks/useDemoteUser"
import { useKickUser } from "../../hooks/useKickUser"

type UserManagementModalProps = {
  isOpen: boolean,
  onClose: () => void,
}

const UserManagementModal: FC<UserManagementModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { selectedGroup } = useConversation();
  const { authUser } = useAuthContext();
  const { promoteUser } = usePromoteUser();
  const { demoteUser } = useDemoteUser();
  const { kickUser } = useKickUser();

  const isOwner = selectedGroup?.owner._id === authUser?._id;
  const isAdmin = selectedGroup?.admins.some(admin => admin._id === authUser?._id);

  const canManage = isAdmin || isOwner;

  const handlePromote = async (userId: string) => {
    if (selectedGroup && selectedGroup?._id) {
      await promoteUser(userId);
      onClose();
    }
  }

  const handleDemote = async (userId: string) => {
    if (selectedGroup && selectedGroup._id) {
      await demoteUser(userId);
      onClose();
    }
  }

  const handleKick = async (userId: string) => {
    if (selectedGroup && selectedGroup._id) {
      await kickUser(userId);
      onClose();
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black opacity-75" />
        </TransitionChild>
        <div className="fixed inset-0 overflow-auto scrollbar scrollbar-track-neutral-700 scrollbar-thumb-neutral-900 hover:scrollbar-thumb-neutral-800">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-sm transform overflow-hidden rounded-lg bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <DialogTitle
                    as="h2"
                    className="text-xl font-bold text-white flex items-center gap-2"
                  >
                    <User size={20} />
                    {t("home.memberManagement")}
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3 justify-between">
                    <div className="flex items-center justify-between gap-2">
                      <img
                        src={selectedGroup?.groupImage}
                        alt={selectedGroup?.groupName}
                        className="size-12 rounded-full"
                      />
                      <h3 className="text-white font-semibold">{selectedGroup?.groupName}</h3>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {selectedGroup?.members.length} {t("home.members")}
                    </p>
                  </div>
                  <div className="border-b-1 mb-2" />
                  {selectedGroup?.members.map((member) => {
                    const isSelf = member.user._id === authUser?._id;
                    const isMemberOwner = member.user._id === selectedGroup.owner._id;
                    const isMemberAdmin = selectedGroup.admins.some(
                      (admin) => admin._id === member.user._id
                    );

                    return (
                      <div
                        key={member.user._id}
                        className="flex items-center justify-between py-2 border-b-1 border-gray-500"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={member.user.profilePicture}
                            alt={member.user.username}
                            className="size-10 rounded-full"
                          />
                          <div>
                            <p className="text-white">{member.user.username}</p>
                            <p className="text-gray-400 text-sm">
                              {isMemberOwner ? "Owner" : isMemberAdmin ? "Admin" : "Member"}
                            </p>
                          </div>
                        </div>
                        {canManage && !isSelf && !isMemberOwner && (
                          <div className="flex gap-2">
                            {!isMemberAdmin && (
                              <button
                                onClick={() => handlePromote(member.user._id)}
                                className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300"
                              >
                                <UserCheck size={16} />
                                {t("home.promoteUser")}
                              </button>
                            )}
                            {isMemberAdmin && isOwner && (
                              <button
                                onClick={() => handleDemote(member.user._id)}
                                className="flex items-center gap-1 text-sm text-yellow-400 hover:text-yellow-300"
                              >
                                <UserX size={16} />
                                {t("home.demoteUser")}
                              </button>
                            )}
                            <button
                              onClick={() => handleKick(member.user._id)}
                              className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
                            >
                              <UserRoundX size={16} />
                              {t("home.kickUser")}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default UserManagementModal