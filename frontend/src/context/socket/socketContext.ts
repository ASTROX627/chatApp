import { createContext, useContext } from "react";
import type { Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null,
  onlineUsers: string[],
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContex = () => {
  const context = useContext(SocketContext);
  if(!context){
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}