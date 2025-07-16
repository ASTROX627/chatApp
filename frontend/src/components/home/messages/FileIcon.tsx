import { FileText, Image } from "lucide-react"
import type { FC } from "react"

type FileIconProps = {
  mimeType: string
}

const FileIcon:FC<FileIconProps> = ({mimeType}) => {
  if (mimeType.startsWith("image/")) {
    return <Image size={16} />
  }
  return <FileText size={16} />
}

export default FileIcon;
