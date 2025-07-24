import { Paperclip, Send } from "lucide-react"
import { type FC, type JSX } from "react"
import { useAppContext } from "../../../context/app/appContext"

type ActionsButtonsProps = {
  onFileClick: () => void,
  canSendMessage: boolean,
  loading: boolean,
}

const ActionButtons: FC<ActionsButtonsProps> = ({ onFileClick, canSendMessage, loading }): JSX.Element => {
  const {language} = useAppContext();
  
  return (
    <div className="flex items-center">
      <button
        type="button"
        disabled={!canSendMessage}
        onClick={onFileClick}
      >
        <Paperclip
          size={22}
          className={`absolute ltr:right-10 rtl:left-10 top-1/5 cursor-pointer text-gray-400 ${!canSendMessage ? "opacity-50" : ""}`}
        />
      </button>
      <button type="submit" disabled={!canSendMessage}>
        {loading ? (
          <div className="loading loading-spinner absolute right-2 top-3"></div>
        ) : (
          <Send
            size={22}
            className={`absolute ltr:right-2 rtl:left-2 top-1/5 cursor-pointer text-gray-200 ${language === "fa" ? "rotate-270" : ""} ${!canSendMessage ? "opacity-50" : ""}`}
          />
        )}
      </button>
    </div>
  )
}

export default ActionButtons;
