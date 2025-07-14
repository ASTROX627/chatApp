import { Paperclip, Send, X } from "lucide-react"
import { useSendMessage } from "../../../hooks/useSendMessage"
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAppContext } from "../../../context/app/appContext";
import { useRef, useState, type ChangeEvent } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

type MessageInputValue = {
  message: string;
}

const MessageInput = () => {
  const { handleSubmit, reset, register } = useForm<MessageInputValue>();
  const { sendMessage, loading } = useSendMessage();
  const { language } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSlectedFile] = useState<File | null>(null);
  const { t } = useTranslation();

  const onSubmit: SubmitHandler<MessageInputValue> = async (data) => {
    if (!data.message.trim() && !selectedFile) {
      return
    }
    await sendMessage(data.message, selectedFile || undefined);
    reset();
    setSlectedFile(null);
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t("home.sizeLimit"));
        return;
      }
      setSlectedFile(file);
    }
  }

  const removeSelectedFile = () => {
    setSlectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="my-3 sticky bottom-0 z-10 w-full">
      {
        selectedFile && (
          <div className="mb-2 p-2 bg-gray-600 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Paperclip size={16} className="text-gray-400" />
              <span className="text-sm text-white truncate max-w-[200px]">
                {selectedFile.name}
              </span>
              <span className="text-xs text-gray-400">
                ({formatFileSize(selectedFile.size)})
              </span>
            </div>
            <button
              type="button"
              onClick={removeSelectedFile}
              className="text-red-400 hover:text-red-300"
            >
              <X size={16} />
            </button>
          </div>
        )
      }
      <form className="my-3 w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full relative">
          <input
            {...register("message")}
            type="text"
            className="border text-sm rounded-lg block w-full bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 p-2.5"
            placeholder={t("home.sendMessage")}
          />
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip
                size={22}
                className="absolute ltr:right-10 rtl:left-10 top-1/5 cursor-pointer text-gray-400"
              />
            </button>
            <button type="submit">
              {loading ? (
                <div className="loading loading-spinner absolute right-2 top-3"></div>
              ) : (
                <Send
                  size={22}
                  className={`absolute ltr:right-2 rtl:left-2 top-1/5 cursor-pointer text-gray-200 ${language === "fa" ? "rotate-270" : ""}`}
                />
              )}
            </button>

          </div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt,.zip"
          />
        </div>
      </form>

    </div>
  )
}

export default MessageInput