import { useRef, useState } from "react"
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export const useFileHandler = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {t} = useTranslation();

  const handleFileSelect = (file: File | null) => {
    if(!file){
      setSelectedFile(null);
      return;
    }

    if(file.size > 10 * 1024 * 1024){
      toast.error(t("home.sizeLimit"));
      return;
    }

    setSelectedFile(file)
  }

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if(fileInputRef.current){
      fileInputRef.current.value = "";
    }
  }

  return {selectedFile, handleFileSelect, removeSelectedFile, fileInputRef}
}