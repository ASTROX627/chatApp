import { useRef, type ChangeEvent, type FC, type JSX } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import ActionButtons from "./ActionsButton"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../../hooks/useTheme"
import useConversation from "../../../store/useConversation"
import { useJoinGroup } from "../../../hooks/usejoinGroup"
import { useMessagePermissions } from "../../../hooks/useMessagePermissions"

type MessageInputFormValue = {
  message: string
}

type MessageInputFormProps = {
  onSubmit: (message: string) => Promise<void>,
  canSendMessage: boolean,
  loading: boolean,
  onFileSelect: (file: File | null) => void,
}

const MessageInputForm: FC<MessageInputFormProps> = ({ onSubmit, canSendMessage, loading, onFileSelect }): JSX.Element => {
  const { register, handleSubmit, reset } = useForm<MessageInputFormValue>();
  const { isMember } = useMessagePermissions();
  const { selectedGroup } = useConversation();
  const { joinGroup, loading: joinLoading } = useJoinGroup();
  const { t } = useTranslation();
  const { classes } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit: SubmitHandler<MessageInputFormValue> = async (data) => {
    await onSubmit(data.message);
    reset();
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
  }

  const handleFileClick = () => {
    fileInputRef.current?.click();
  }

  const handleJoinGroup = async () => {
    if (selectedGroup) {
      await joinGroup(selectedGroup._id)
    }
  }

  return (
    <form className="w-full" onSubmit={handleSubmit(handleFormSubmit)}>
      {
        canSendMessage ? (
          <div className="w-full relative">
            <input
              {...register("message")}
              type="text"
              disabled={!canSendMessage}
              className="border text-sm block w-full bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 p-2.5 disabled:bg-gray-800 disabled:cursor-not-allowed"
              placeholder={t("home.sendMessage")}
            />
            <ActionButtons
              onFileClick={handleFileClick}
              canSendMessage={canSendMessage}
              loading={loading}
            />
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInputChange}
              disabled={!canSendMessage}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt,.zip"
            />
          </div>

        ) : (
          !isMember ? (
            <button
              type="button"
              onClick={handleJoinGroup}
              className={`${classes.secondary.bg} w-full py-2.5 cursor-pointer`}>
              {joinLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                t("home.join")
              )}

            </button>
          ) : (
            <div className="w-full relative">
              <input
                type="text"
                disabled
                className="border text-sm block w-full bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 p-2.5 disabled:bg-gray-800 disabled:cursor-not-allowed"
                placeholder={t("home.notAllowed")}
              />
              <ActionButtons
                onFileClick={handleFileClick}
                canSendMessage={canSendMessage}
                loading={loading}
              />
            </div>
          )
        )
      }
    </form>
  )
}

export default MessageInputForm