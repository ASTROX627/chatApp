import { useRef, type ChangeEvent, type FC, type JSX } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import ActionButtons from "./ActionsButton"
import { useTranslation } from "react-i18next"

type MessageInputFormValue = {
  message: string
}

type MessageInputFormProps = {
  onSubmit: (message: string) => Promise<void>,
  canSendMessage: boolean,
  loading: boolean,
  onFileSelect: (file: File | null) => void
}

const MessageInputForm: FC<MessageInputFormProps> = ({ onSubmit, canSendMessage, loading, onFileSelect }): JSX.Element => {
  const { register, handleSubmit, reset } = useForm<MessageInputFormValue>();
  const {t} = useTranslation();
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

  return (
    <form className="w-full" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="w-full relative">
        <input
          {...register("message")}
          type="text"
          disabled={!canSendMessage}
          className="border text-sm block w-full bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 p-2.5 disabled:bg-gray-800 disabled:cursor-not-allowed"
          placeholder={canSendMessage ? t("home.sendMessage") : t("home.notAllowed")}
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
    </form>
  )
}

export default MessageInputForm