export const extractTime = (data: string) => {
  const date = new Date(data);
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  return (
    `\u200E${hours}:${minutes}`
  )
}

const padZero = (number: number) => {
  return number.toString().padStart(2, "0");
}