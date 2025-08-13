export type ThemeType = "sky" | "spring" | "fall" | "winter"
export type LanguageType = "en" | "fa"
export type NavigationPageType = "chat" | "groupChat" | "groupProfile"


export type StateType = {
  showChatMenu: boolean,
  showSettingMenu: boolean,
  showCreateGroupMenu: boolean,
  showSidebar: boolean,
  showMessageContainer: boolean,
  showProfile: boolean
  theme: ThemeType,
  isActiveChatButton: boolean,
  isActiveSettingButton: boolean,
  isActiveCreateGroupButton: boolean,
  language: LanguageType
  navigationHistory: NavigationPageType[]
}

type ActionType =
  | { type: "RESET_STATE" }
  | { type: "SHOW_CHAT_MENU" }
  | { type: "SHOW_SETTING_MENU" }
  | { type: "SHOW_CREATE_GROUP_MENU" }
  | { type: "SHOW_SIDEBAR" }
  | { type: "SHOW_MESSAGE_CONTAINER" }
  | { type: "SHOW_PROFILE" }
  | { type: "CHANGE_THEME"; payload: ThemeType }
  | { type: "CHANGE_LANGUAGE"; payload: LanguageType }
  | { type: "PUSH_TO_HISTORY"; payload: NavigationPageType }
  | { type: "GO_BACK" };

const appReducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case "RESET_STATE":
      return {
        ...state,
        showChatMenu: true,
        showSettingMenu: false,
        showCreateGroupMenu: false,
        showSidebar: false,
        showMessageContainer: false,
        showProfile: false,
        isActiveChatButton: true,
        isActiveSettingButton: false,
        isActiveCreateGroupButton: false,
        navigationHistory: [],
      }
    case "SHOW_CHAT_MENU":
      return {
        ...state,
        showChatMenu: true,
        showSettingMenu: false,
        showCreateGroupMenu: false,
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
        showCreateGroupMenu: false,
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
        showCreateGroupMenu: true,
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
      console.log("message container trigger");

      const isLargeScreen = window.innerWidth >= 1024;
      return {
        ...state,
        activeMenu: !isLargeScreen ? false : state.showChatMenu,
        showSidebar: false,
        showMessageContainer: true,
        showProfile: false,
      }
    }
    case "SHOW_PROFILE": {
      const isLargeScreen = window.innerWidth >= 1024;
      return {
        ...state,
        activeMenu: !isLargeScreen ? false : state.showChatMenu,
        showSidebar: false,
        showMessageContainer: false,
        showProfile: true,
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
    case "PUSH_TO_HISTORY":
      return {
        ...state,
        navigationHistory: [...state.navigationHistory, action.payload]
      }
    case "GO_BACK": {
      const history = [...state.navigationHistory];
      const currentPage = history.pop();
      const previousPage = history[history.length - 1];

      let newState = {
        ...state,
        navigationHistory: history,
        showChatMenu: true,
        showSidebar: false,
      };
      if (currentPage === "groupProfile" && previousPage === "groupChat") {
        newState = {
          ...newState,
          showMessageContainer: false,
          showProfile: true,
        };
      }
      else if (previousPage === "groupChat") {
        newState = {
          ...newState,
          showMessageContainer: true,
          showProfile: false,
        };
      }
      else if (previousPage === "chat") {
        newState = {
          ...newState,
          showMessageContainer: true,
          showProfile: false,
        };
      }
      else {
        newState = {
          ...newState,
          showMessageContainer: history.length === 0,
          showProfile: false,
        };
      }

      return newState;
    }
  }
}

export default appReducer;