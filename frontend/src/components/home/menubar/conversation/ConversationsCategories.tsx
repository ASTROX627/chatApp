import type { FC } from "react";
import { useTranslation } from "react-i18next";

type ConversationsCategoriesProps = {
  selected: string,
  onSelect: (conversationsCategory: string) => void,
}

const ConversationsCategories:FC<ConversationsCategoriesProps> = ({selected, onSelect}) => {
  const { t } = useTranslation();
  const conversationsCategories = [
    {name: t("home.all"), value: "all"}, 
    {name: t("home.private"), value: "private"}, 
    {name: t("home.groups"), value: "group"}, 
    {name: t("home.channels"), value: "channel"}, 
  ]
  return (
    <div className="flex items-center justify-start bg-gray-600 overscroll-x-auto scrollbar scrollbar-track-neutral-700 scrollbar-thumb-neutral-900 hover:scrollbar-thumb-neutral-800">
      {conversationsCategories.map((conversationsCategory) => (
        <button 
          key={conversationsCategory.value}
          onClick={() => onSelect(conversationsCategory.value)}
          className={`cursor-pointer  border-e-1 border-e-gray-900 px-5 py-2 hover:bg-slate-700 transition-all duration-200 ${selected === conversationsCategory.value ? "bg-slate-700": ""}`}>{conversationsCategory.name}</button>
      ))}
    </div>
  )
}

export default ConversationsCategories
