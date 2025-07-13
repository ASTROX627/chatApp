import { useEffect, useReducer, type FC, type PropsWithChildren } from "react";
import appReducer, { type LanguageType, type ThemeType } from "./appReducer";
import { AppContext } from "./appContext";
import { THEME_CONFIGS } from "../../configs/theme/themConfig";
import { getColorValues } from "../../configs/theme/getColorValues";
import { useTranslation } from "react-i18next";

const initialState = {
  showChatMenu: true,
  showSettingMenu: false,
  ShowCreateGroupMenu: false,
  isActiveChatButton: true,
  isActiveSettingButton: false,
  isActiveCreateGroupButton: false,
  theme: (localStorage.getItem("theme") as ThemeType) || "sky",
  language: (localStorage.getItem("language") as LanguageType) || "en"
}

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, disatch] = useReducer(appReducer, initialState);
  const { i18n } = useTranslation();

  const setShowChatMenu = () => {
    disatch({ type: "SHOW_CHAT_MENU" })
  }

  const setShowSettingMenu = () => {
    disatch({ type: "SHOW_SETTING_MENU" })
  }

  const setShowCreateGroupMenu = () => {
    disatch({ type: "SHOW_CREATE_GROUP_MENU" })
  }

  const changeTheme = (theme: ThemeType) => {
    disatch({ type: "CHANGE_THEME", payload: theme });
  }

  const changeLanguage = (language: LanguageType) => {
    disatch({ type: "CHANGE_LANGUAGE", payload: language })
  }

  useEffect(() => {
    const config = THEME_CONFIGS[state.theme];
    const primaryRgb = getColorValues(config.primaryColor);
    const secondaryRgb = getColorValues(config.secondaryColor);

    document.body.style.background = `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/images/${state.theme}.jpg)`;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundSize = "cover";

    document.documentElement.style.setProperty("--theme-primary", config.primaryColor);
    document.documentElement.style.setProperty("--theme-secondary", config.secondaryColor);
    document.documentElement.style.setProperty("--theme-primary-rgb", `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
    document.documentElement.style.setProperty("--theme-secondary-rgb", `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);

    localStorage.setItem("theme", state.theme);
  }, [state.theme]);

  useEffect(() => {
    i18n.changeLanguage(state.language);
    document.documentElement.dir = state.language === "en" ? "ltr" : "rtl";
    localStorage.setItem("language", state.language)
  }, [i18n, state.language])

  return (
    <AppContext.Provider value={{ ...state, setShowChatMenu, setShowSettingMenu, setShowCreateGroupMenu, changeTheme, changeLanguage }}>
      {children}
    </AppContext.Provider>
  )
}