import { useFileHandler } from "../../../hooks/useFileHandler";
import { useMessagePermissions } from "../../../hooks/useMessagePermissions";
import { useSendGroupMessage } from "../../../hooks/useSendGroupMessage";
import { useSendMessage } from "../../../hooks/useSendMessage";
import FilePreview from "./FilePreview";
import MessageInputForm from "./MessageInputForm";
import PermissionAlert from "./PermissionAlert";


const MessageInput = () => {
  const { sendMessage, loading: privateLoading } = useSendMessage();
  const { sendGroupMessage, loading: groupLoading } = useSendGroupMessage();
  const { canSendMessage, isGroupChat } = useMessagePermissions();
  const { selectedFile, handleFileSelect, removeSelectedFile } = useFileHandler();

  const loading = isGroupChat ? groupLoading : privateLoading;

  const handleSubmit = async (message: string) => {
    if (!message.trim() && !selectedFile) {
      return;
    }

    if (isGroupChat) {
      await sendGroupMessage(message, selectedFile || undefined);
    } else {
      await sendMessage(message, selectedFile || undefined);
    }

    removeSelectedFile();
  };

  return (
    <div className="sticky bottom-0 z-10 w-full">
      {!canSendMessage && (
        <PermissionAlert />
      )}

      {selectedFile && (
        <FilePreview file={selectedFile} onRemove={removeSelectedFile} />
      )}

      <MessageInputForm
        onSubmit={handleSubmit}
        canSendMessage={canSendMessage}
        loading={loading}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
};

export default MessageInput;