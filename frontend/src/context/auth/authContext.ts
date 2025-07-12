import { createContext, useContext, type Dispatch, type SetStateAction} from "react";

export interface AuthUser{
  _id: string,
  fullName: string,
  username: string,
  gender: "male" | "female",
  profilePicture: string
}

interface AuthContextType {
  authUser: AuthUser | null,
  setAuthUser: Dispatch<SetStateAction<AuthUser | null>>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if(!context){
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}