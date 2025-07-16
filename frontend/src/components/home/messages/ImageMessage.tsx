import type { FC, JSX } from "react"

type ImageMesssageProps = {
  fileUrl: string,
  fileName?: string,
  onClick: (src: string, alt: string) => void
}



const ImageMessage:FC<ImageMesssageProps> = ({fileName, fileUrl, onClick}):JSX.Element => {
  const imageUrl = `${import.meta.env.VITE_BASE_URL}${fileUrl}`;

  return(
    <div className="max-w-xs">
      <img 
        src={imageUrl} 
        alt={fileName || "Image"}
        className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => onClick(imageUrl, fileName || "Image")}
      />
      {
        fileName && (
          <p className="text-xs text-gray-300 mt-1">{fileName}</p>
        )
      }
    </div>
  )
}

export default ImageMessage
