export type ThemeType = "sky" | "spring" | "fall" | "winter"
export type LanguageType = "en" | "fa"

type StateType = {
  showChatMenu: boolean,
  showSettingMenu: boolean,
  theme: ThemeType,
  isActiveChatButton: boolean,
  isActiveSettingButton: boolean,
  language: LanguageType
}

type ActionWithType = {
  type: "SHOW_CHAT_MENU" | "SHOW_SETTING_MENU"
}


type ChangeThemeActionWithTypeAndPayload = {
  type: "CHANGE_THEME",
  payload: ThemeType
}

type ChangeLanguageActionWithTypeAndPayload = {
  type: "CHANGE_LANGUAGE"
  payload: LanguageType
}

type ActionWithTypeAndPayload = ChangeThemeActionWithTypeAndPayload | ChangeLanguageActionWithTypeAndPayload;

type ActionType = ActionWithType |  ActionWithTypeAndPayload

const appReducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case "SHOW_CHAT_MENU":
      return {
        ...state,
        showChatMenu: true,
        showSettingMenu: false,
        isActiveChatButton: true,
        isActiveSettingButton: false
      }
    case "SHOW_SETTING_MENU":
      return {
        ...state,
        showSettingMenu: true,
        showChatMenu: false,
        isActiveChatButton: false,
        isActiveSettingButton: true
      }
    case "CHANGE_THEME":
      return {
        ...state,
        theme: action.payload
      }
    case "CHANGE_LANGUAGE":
      return{
        ...state,
        language: action.payload
      }
  }
}

export default appReducer;