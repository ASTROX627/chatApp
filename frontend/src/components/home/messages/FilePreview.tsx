import { Paperclip, X } from "lucide-react"
import type { FC, JSX } from "react"

type FilePreviewProps = {
  file: File,
  onRemove: () => void
}

const FilePreview: FC<FilePreviewProps> = ({file, onRemove}): JSX.Element => {
  return (
    <div className="mb-2 p-2 bg-gray-600 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Paperclip size={16} className="text-gray-400" />
        <span className="text-sm text-white truncate max-w-[200px]">
          {file.name}
        </span>
        <span className="text-xs text-gray-400">
          {file.size}
        </span>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="text-red-400 hover:text-red-300"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export default FilePreview;
