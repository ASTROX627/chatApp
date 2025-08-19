import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { SocketContext } from "./socketContext";
import { useAuthContext } from "../auth/authContext";
import io, { Socket } from "socket.io-client";

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const socket = io(import.meta.env.VITE_BASE_URL, {
        query: {
          userId: authUser._id
        }
      });
      setSocket(socket);

      socket.on("getOnlineUser", (users) => {
        setOnlineUsers(users);
      })
      return () => {
        socket.close();
      }
    } else {
      if (socket) {
        socket.close();
        setSocket(null)
      }
    }
  }, [authUser])

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  )
}