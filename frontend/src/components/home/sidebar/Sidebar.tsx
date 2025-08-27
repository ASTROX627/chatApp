import { useCallback, useEffect, useRef, type FC, type JSX } from "react";
import Logout from "./Logout";
import { useAppContext } from "../../../context/app/appContext";
import MenuButton from "./MenuButton";
import { MessageCircle, Pencil, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

const Sidebar: FC = (): JSX.Element => {
  const { showSidebar, setShowSidebar, setShowChatMenu, setShowCreateGroupMenu, setShowSettingMenu, isActiveChatButton, isActiveCreateGroupButton, isActiveSettingButton } = useAppContext();
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  const checkIfClickOutside = useCallback((e: MouseEvent) => {
    if (showSidebar && ref.current && !ref.current.contains(e.target as Node)) {
      setShowSidebar();
    }
  }, [showSidebar, setShowSidebar]);

  useEffect(() => {
    if (showSidebar) {
      document.addEventListener("mousedown", checkIfClickOutside);
      return () => document.removeEventListener("mousedown", checkIfClickOutside);
    }
  }, [showSidebar, checkIfClickOutside]);


  return (
    <div
      ref={ref}
      className={`h-full border-gray-500 z-30 flex flex-col justify-between items-center shadow-lg transition-all duration-300 ease-in-out overflow-hidden
        ${showSidebar ? "w-[70vw] absolute bg-slate-800" : "w-0 absolute bg-slate-800"}
        lg:w-auto lg:static lg:opacity-100 lg:translate-x-0 lg:bg-transparent lg:shadow-none lg:rounded-s-md`}
    >
      <div className={`flex flex-col w-full transition-all duration-300 ease-in-out 
        ${showSidebar ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"}
        lg:opacity-100 lg:translate-x-0 lg:w-auto`}>
        <MenuButton
          onClick={setShowChatMenu}
          isActive={isActiveChatButton}
          icon={<MessageCircle size={30} className="lg:size-20" />}
          label={t("home.chats")}
        />
        <MenuButton
          onClick={setShowSettingMenu}
          isActive={isActiveSettingButton}
          icon={<Settings size={30} className="lg:size-20" />}
          label={t("home.settings")}
        />
        <MenuButton
          onClick={setShowCreateGroupMenu}
          isActive={isActiveCreateGroupButton}
          icon={<Pencil size={30} className="lg:size-20" />}
          label={t("home.createGroup")}
        />
      </div>
      <div className={`transition-all duration-300 ease-in-out 
        ${showSidebar ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"}
        lg:opacity-100 lg:translate-x-0`}>
        <Logout />
      </div>
    </div>
  )
}

export default Sidebar