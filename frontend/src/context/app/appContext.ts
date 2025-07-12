/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext } from "react";
import type { LanguageType, ThemeType } from "./appReducer";

type AppContextType = {
  showChatMenu: boolean;
  showSettingMenu: boolean;
  isActiveChatButton: boolean,
  isActiveSettingButton: boolean
  theme: ThemeType;
  language: LanguageType;
  setShowChatMenu: () => void;
  setShowSettingMenu: () => void;
  changeTheme: (theme: ThemeType) => void;
  changeLanguage: (language: LanguageType) => void;
};

export const AppContext = createContext<AppContextType>({
  showChatMenu: true,
  showSettingMenu: false,
  isActiveChatButton: true,
  isActiveSettingButton: false,
  theme: "sky",
  language: 'en',
  setShowChatMenu: () => { },
  setShowSettingMenu: () => { },
  changeTheme: (theme: ThemeType) => { },
  changeLanguage: (language: LanguageType) => {}
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context
}
