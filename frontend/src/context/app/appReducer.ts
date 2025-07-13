export type ThemeType = "sky" | "spring" | "fall" | "winter"
export type LanguageType = "en" | "fa"

type StateType = {
  showChatMenu: boolean,
  showSettingMenu: boolean,
  ShowCreateGroupMenu: boolean,
  theme: ThemeType,
  isActiveChatButton: boolean,
  isActiveSettingButton: boolean,
  isActiveCreateGroupButton: boolean,
  language: LanguageType
}

type ActionWithType = {
  type: "SHOW_CHAT_MENU" | "SHOW_SETTING_MENU" | "SHOW_CREATE_GROUP_MENU"
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

type ActionType = ActionWithType | ActionWithTypeAndPayload

const appReducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case "SHOW_CHAT_MENU":
      return {
        ...state,
        showChatMenu: true,
        showSettingMenu: false,
        ShowCreateGroupMenu: false,
        isActiveChatButton: true,
        isActiveSettingButton: false,
        isActiveCreateGroupButton: false
      }
    case "SHOW_SETTING_MENU":
      return {
        ...state,
        showChatMenu: false,
        showSettingMenu: true,
        ShowCreateGroupMenu: false,
        isActiveChatButton: false,
        isActiveSettingButton: true,
        isActiveCreateGroupButton: false
      }
    case "SHOW_CREATE_GROUP_MENU":
      return {
        ...state,
        showChatMenu: false,
        showSettingMenu: false,
        ShowCreateGroupMenu: true,
        isActiveChatButton: false,
        isActiveSettingButton: false,
        isActiveCreateGroupButton: true
      }
    case "CHANGE_THEME":
      return {
        ...state,
        theme: action.payload
      }
    case "CHANGE_LANGUAGE":
      return {
        ...state,
        language: action.payload
      }
  }
}

export default appReducer;