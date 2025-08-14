import Messages from "./Messages"
import NoChatSelected from "./NoChatSelected";
import { useAppContext } from "../../../context/app/appContext";
import { ArrowLeft, ArrowRight, EllipsisVertical, Hash, Lock, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FC, type JSX, type MouseEvent } from "react";
import useConversation from "../../../store/useConversation";
import { useTranslation } from "react-i18next";
import MessageInput from "./MessageInput";
import { useTheme } from "../../../hooks/useTheme";
import { useGetUserProfile } from "../../../hooks/useGetUserProfile";
import { useGetGroupProfile } from "../../../hooks/useGetGroupProfile";
import { twMerge } from "tailwind-merge";
import OptionsDropdown from "./OptionsDropdown";

const MessageContainer: FC = (): JSX.Element => {
  const { selectedConversation, selectedGroup, setSelectedGroup } = useConversation();
  const { showMessageContainer, setShowChatMenu, language, setShowProfile, pushToHistory } = useAppContext();
  const { getUserProfile } = useGetUserProfile();
  const { getGroupProfile } = useGetGroupProfile();
  const { t } = useTranslation();
  const { classes } = useTheme();

  const [showOptions, setShowOptions] = useState(false);
  const optionRef = useRef<HTMLDivElement>(null);

  const activeChat = selectedConversation || selectedGroup;


  const checkIfClickOutside = useCallback((e: globalThis.MouseEvent) => {
    if (showOptions && optionRef.current && !optionRef.current.contains(e.target as Node)) {
      const optionsButton = (e.target as Element).closest("button");
      if (optionsButton && optionsButton.querySelector("svg")) {
        return
      }
      setShowOptions(false);
    }
  }, [showOptions, setShowOptions]);

  useEffect(() => {
    if (showOptions) {
      document.addEventListener("mousedown", checkIfClickOutside);
      return () => document.removeEventListener("mousedown", checkIfClickOutside);
    }
  }, [showOptions, checkIfClickOutside]);

  const handleAvatarClick = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedConversation) {
      pushToHistory("chat");
      await getUserProfile(selectedConversation._id);
      setTimeout(() => setShowProfile(), 50);

    } else if (selectedGroup) {
      pushToHistory("groupChat");
      const currentGroup = selectedGroup;
      await getGroupProfile(selectedGroup._id);
      setSelectedGroup(currentGroup)
      setTimeout(() => setShowProfile(), 50);
    }

  }

  return (
    <div className={twMerge(
      "relative h-full overflow-auto scrollbar scrollbar-track-neutral-700 scrollbar-thumb-neutral-900 hover:scrollbar-thumb-neutral-800 border-gray-500 rounded-e-md lg:w-full lg:block flex",
      showMessageContainer ? "w-full" : "w-0",
    )}>
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
            <div className="relative">
              <button onClick={() =>
                setShowOptions(!showOptions)
              } className={twMerge("size-6 cursor-pointer")}>
                <EllipsisVertical size={26} />
              </button>
              {
                showOptions && (
                  <div
                    ref={optionRef}
                    className={twMerge("absolute top-10 ltr:right-0 rtl:left-0 w-38 rounded-md shadow-lg z-20 border border-gray-600", classes.primary.bg)}
                  >
                    <OptionsDropdown />
                  </div>
                )
              }
            </div>

          </nav>
          <Messages />
          <MessageInput />
        </div>
      )}

    </div>
  )
}

export default MessageContainer;