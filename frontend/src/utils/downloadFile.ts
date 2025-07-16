export const downloadFile = (fileUrl: string, fileName?: string) => {
  const link = document.createElement("a");
  link.href = `${import.meta.env.VITE_BASE_URL}${fileUrl}`;
  link.download = fileName || "Download-file";
  link.target = "_blank"
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

