export type ThemeType = "sky" | "spring" | "fall" | "winter"
export type LanguageType = "en" | "fa"

type StateType = {
  showChatMenu: boolean,
  showSettingMenu: boolean,
  ShowCreateGroupMenu: boolean,
  showSidebar: boolean,
  showMessageContainer: boolean,
  theme: ThemeType,
  isActiveChatButton: boolean,
  isActiveSettingButton: boolean,
  isActiveCreateGroupButton: boolean,
  language: LanguageType
}

type ActionWithType = {
  type: "SHOW_CHAT_MENU" | "SHOW_SETTING_MENU" | "SHOW_CREATE_GROUP_MENU" | "SHOW_SIDEBAR" | "SHOW_MESSAGE_CONTAINER"
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
        showSidebar: false,
        showMessageContainer: false,
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
        showSidebar: false,
        showMessageContainer: false,
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
        showSidebar: false,
        showMessageContainer: false,
        isActiveChatButton: false,
        isActiveSettingButton: false,
        isActiveCreateGroupButton: true
      }
    case "SHOW_SIDEBAR":
      return {
        ...state,
        showSidebar: !state.showSidebar
      }
    case "SHOW_MESSAGE_CONTAINER": {
      return {
        ...state,
        showChatMenu: false,
        showSettingMenu: false,
        ShowCreateGroupMenu: false,
        showSidebar: false,
        showMessageContainer: true,
      }
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