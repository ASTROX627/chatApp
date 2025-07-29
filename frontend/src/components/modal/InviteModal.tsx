import { Fragment, type FC, type JSX } from "react"
import { useGenerateInviteLink } from "../../hooks/useGenerateInviteLink"
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { Users, X } from "lucide-react"
import useConversation from "../../store/useConversation"
import { useTranslation } from "react-i18next"
import useGetConversations from "../../hooks/useGetConversations"
import type { ConversationType } from "../../types/conversations"
import Conversation from "../home/menubar/conversation/Conversation"


type InviteModalProps = {
  isOpen: boolean,
  onClose: () => void
}

const InviteModal: FC<InviteModalProps> = ({ isOpen, onClose }): JSX.Element => {
  const { generateInviteLink } = useGenerateInviteLink();
  const { selectedGroup } = useConversation();
  const { conversations } = useGetConversations();
  const { t } = useTranslation();

  const handleInvite = async (userId: string) => {
    if(selectedGroup?._id && userId){
      await generateInviteLink(userId);
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom='opacity-0'
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
                    <Users size={20} />
                    {t("home.inviteMembers")}
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
                  {
                    conversations.map((conversation: ConversationType, index) => (
                      <Conversation
                        key={`${conversation.type}-${conversation._id}`}
                        conversation={conversation.type === "user" ? conversation as ConversationType : undefined}
                        emoji={conversation.emoji}
                        lastIndex={index === conversations.length - 1}
                        handleInvite={() => handleInvite(conversation._id)}
                      />
                    ))
                  }
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default InviteModal;