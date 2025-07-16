import { Download } from 'lucide-react'
import { type FC, type JSX } from 'react'
import { formatFileSize } from '../../../utils/formatFileSize'
import { downloadFile } from '../../../utils/downloadFile'
import FileIcon from './FileIcon'

type FileMessageProps = {
  fileMimeType?: string,
  fileName?: string,
  fileSize?: number,
  fileUrl: string
}

const FileMessage:FC<FileMessageProps> = ({fileMimeType = "", fileName, fileSize, fileUrl}):JSX.Element => {
  return (
    <div className="bg-gray-600 rounded-lg p-3 max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <FileIcon mimeType={fileMimeType}/>
        <span className="text-sm truncate flex-1">{fileName}</span>
      </div>
      <div className="flex items-baseline justify-between gap-1">
        <span className="text-xs text-gray-300">
          {fileSize && formatFileSize(fileSize)}
        </span>
        <button
          onClick={() => downloadFile(fileUrl, fileName || "download")}
          className="text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
        >
          <Download size={14} />
        </button>
      </div>
    </div>
  );
}

export default FileMessage