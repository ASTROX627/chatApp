import { ExternalLink } from "lucide-react";
import type { FC } from "react"

type LinkMessageProps = {
  url: string,
}

const LinkMessage: FC<LinkMessageProps> = ({ url }) => {

  const handleLinkClick = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }
  return (
    <div
      onClick={handleLinkClick}
      className="bg-gray-600 rounded-lg max-w-xs cursor-pointer hover:bg-gray-500 transition-colors"
    >
      <div className="flex gap-3 items-center justify-center w-full p-2">
        <ExternalLink size={16} className="text-blue-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-blue-400 truncate">{getDomain(url)}</p>
        </div>
      </div>
    </div>
  )
}

export default LinkMessage
