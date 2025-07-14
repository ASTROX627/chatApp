import { useCallback, useEffect, useRef, type FC, type JSX } from "react";
import ConversationMenuButton from "./ConversationMenuButton";
import CreateGroupMenuButton from "./CreateGroupMenuButton";
import Logout from "./Logout";
import SettingMenuButton from "./SettingMenuButton";
import { useAppContext } from "../../../context/app/appContext";

const Sidebar: FC = (): JSX.Element => {
  const { showSidebar, setShowSidebar } = useAppContext();
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
      className={`h-full border-gray-500 bg-slate-800 z-10 absolute flex flex-col justify-between items-center shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${showSidebar ? "w-[70vw]" : "w-0"
        }`}
    >
      <div
        className={`flex flex-col w-full transition-all duration-300 ease-in-out ${showSidebar ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
          }`}
      >
        <ConversationMenuButton />
        <SettingMenuButton />
        <CreateGroupMenuButton />
      </div>

      <div
        className={`transition-all duration-300 ease-in-out ${showSidebar ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
          }`}
      >
        <Logout />
      </div>
    </div>
  )
}

export default Sidebar