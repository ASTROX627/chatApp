import { Request } from "express";
import i18next from "../core/i18n"

export const getLocalizedMessage = (req: Request, key: string): string => {
  const language = req.headers[`accept-language`] || "en";
  return i18next.t(key, {lng: language})
}