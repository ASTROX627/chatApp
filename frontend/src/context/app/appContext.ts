/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext } from "react";
import type { LanguageType, ThemeType } from "./appReducer";

type AppContextType = {
  showChatMenu: boolean;
  showSettingMenu: boolean;
  ShowCreateGroupMenu: boolean;
  showSidebar: boolean;
  showMessageContainer: boolean;
  showProfile: boolean;
  isActiveChatButton: boolean;
  isActiveSettingButton: boolean;
  isActiveCreateGroupButton: boolean,
  theme: ThemeType;
  language: LanguageType;
  resetState: () => void;
  setShowChatMenu: () => void;
  setShowSettingMenu: () => void;
  setShowCreateGroupMenu: () => void;
  setShowSidebar: () => void;
  setShowMessageContainer: () => void;
  setShowProfile: () => void;
  changeTheme: (theme: ThemeType) => void;
  changeLanguage: (language: LanguageType) => void;
};

export const AppContext = createContext<AppContextType>({
  showChatMenu: true,
  showSettingMenu: false,
  ShowCreateGroupMenu: false,
  showSidebar: false,
  showMessageContainer: false,
  showProfile: false,
  isActiveChatButton: true,
  isActiveSettingButton: false,
  isActiveCreateGroupButton: false,
  theme: "sky",
  language: 'en',
  resetState: () => {},
  setShowChatMenu: () => { },
  setShowSettingMenu: () => { },
  setShowCreateGroupMenu: () => {},
  setShowSidebar: () => { },
  setShowMessageContainer: () => {},
  setShowProfile: () => {},
  changeTheme: (theme: ThemeType) => { },
  changeLanguage: (language: LanguageType) => { },
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context
}
