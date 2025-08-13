/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext } from "react";
import type { LanguageType, NavigationPageType, ThemeType } from "./appReducer";


type AppContextType = {
  showSidebar: boolean;
  showMessageContainer: boolean;
  showProfile: boolean;
  showChatMenu: boolean;
  showSettingMenu: boolean;
  showCreateGroupMenu: boolean;
  isActiveChatButton: boolean;
  isActiveSettingButton: boolean;
  isActiveCreateGroupButton: boolean;
  theme: ThemeType;
  language: LanguageType;
  navigationHistory: NavigationPageType[];
  resetState: () => void;
  setShowSidebar: () => void;
  setShowMessageContainer: () => void;
  setShowProfile: () => void;
  setShowChatMenu: () => void,
  setShowSettingMenu: () => void,
  setShowCreateGroupMenu: () => void,
  changeTheme: (theme: ThemeType) => void;
  changeLanguage: (language: LanguageType) => void;
  pushToHistory: (page: NavigationPageType) => void;
  goBack: () => void
};

export const AppContext = createContext<AppContextType>({
  showSidebar: false,
  showMessageContainer: false,
  showProfile: false,
  showChatMenu: true,
  showCreateGroupMenu: false,
  showSettingMenu: false,
  isActiveChatButton: true,
  isActiveCreateGroupButton: false,
  isActiveSettingButton: false,
  theme: "sky",
  language: 'en',
  navigationHistory: [],
  resetState: () => {},
  setShowSidebar: () => { },
  setShowMessageContainer: () => {},
  setShowProfile: () => {},
  setShowChatMenu: () => {},
  setShowSettingMenu: () => {},
  setShowCreateGroupMenu: () => {},
  changeTheme: (theme: ThemeType) => { },
  changeLanguage: (language: LanguageType) => { },
  pushToHistory: () => { },
  goBack: () => { }
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context
}
