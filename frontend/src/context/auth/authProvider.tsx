import { useState, type FC, type PropsWithChildren } from "react";
import { AuthContext, type AuthUser } from "./authContext";

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem("chat-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};