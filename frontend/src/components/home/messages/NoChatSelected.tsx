import { MessageSquare } from "lucide-react"
import { useAuthContext } from "../../../context/auth/authContext"
import { useTranslation } from "react-i18next";
import type { FC, JSX } from "react";

const NoChatSelected:FC = ():JSX.Element => {
  const {authUser} = useAuthContext();
  const {t} = useTranslation();
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center text-gray-200 font-semibold flex flex-col items-center gap-2 text-xl">
        <p>{t("home.welcome")} 👋 {authUser?.username}</p>
        <p>{t("home.selectUser")}</p>
        <MessageSquare size={32} className="text-center"/>
      </div>
    </div>
  )
}

export default NoChatSelected