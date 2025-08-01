export type ThemeType = "sky" | "spring" | "fall" | "winter"
export type LanguageType = "en" | "fa"

type StateType = {
  showChatMenu: boolean,
  showSettingMenu: boolean,
  ShowCreateGroupMenu: boolean,
  showSidebar: boolean,
  showMessageContainer: boolean,
  showProfile: boolean
  theme: ThemeType,
  isActiveChatButton: boolean,
  isActiveSettingButton: boolean,
  isActiveCreateGroupButton: boolean,
  language: LanguageType
}

type ActionWithType = {
  type: "SHOW_CHAT_MENU" | 
    "SHOW_SETTING_MENU" | 
    "SHOW_CREATE_GROUP_MENU" | 
    "SHOW_SIDEBAR" | 
    "SHOW_MESSAGE_CONTAINER" | 
    "SHOW_PROFILE" |
    "RESET_STATE"
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
    case "RESET_STATE":
      return {
        ...state,
        showChatMenu: true,
        showSettingMenu: false,
        ShowCreateGroupMenu: false,
        showSidebar: false,
        showMessageContainer: false,
        showProfile: false,
        isActiveChatButton: true,
        isActiveSettingButton: false,
        isActiveCreateGroupButton: false
      }
    case "SHOW_CHAT_MENU":
      return {
        ...state,
        showChatMenu: true,
        showSettingMenu: false,
        ShowCreateGroupMenu: false,
        showSidebar: false,
        showMessageContainer: false,
        showProfile: false,
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
        showProfile: false,
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
        showProfile: false,
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
      const isLargeScreen = window.innerWidth >= 1024;
      return {
        ...state,
        showChatMenu: !isLargeScreen ? false : state.showChatMenu,
        showSettingMenu: false,
        ShowCreateGroupMenu: false,
        showSidebar: false,
        showMessageContainer: true,
        showProfile: false
      }
    }
    case "SHOW_PROFILE":{
      const isLargeScreen = window.innerWidth >= 1024;
      return {
        ...state,
        showChatMenu: !isLargeScreen ? false : state.showChatMenu,
        showSettingMenu: false,
        ShowCreateGroupMenu: false,
        showSidebar: false,
        showMessageContainer: false,
        showProfile: true
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