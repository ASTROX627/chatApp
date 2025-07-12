import type { AuthUser } from "./authContext"

export type AuthState = {
  authUser: AuthUser | null;
}

type AuthActionWithType = {
  type: "LOGOUT"
}

type AuthActionWithTypeAndPayload = {
  type: "LOGIN",
  payload: AuthUser
}

export type AuthActionType = AuthActionWithType | AuthActionWithTypeAndPayload

export const authReducer = (state: AuthState, action: AuthActionType): AuthState => {
  switch (action.type){
    case "LOGIN":
      localStorage.setItem("chat-user", JSON.stringify(action.payload));
      return{
        authUser: action.payload
      }
    case "LOGOUT":
      localStorage.removeItem("chat-user");
      return{
        authUser: null
      }
    default:
      return state
  }
}