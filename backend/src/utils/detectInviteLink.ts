export const detectInviteLink = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.includes("/invite/")
  } catch (error) {
    return false
  }
}