import Cookies from "js-cookie";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../utils/config";
import { decodeToken } from "../utils/heplerFunction";

interface SocketContextProps {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const SocketProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const token = Cookies.get("token");
  useEffect(() => {
    if (token) {
      const socketInstance = io(SOCKET_URL);

      const { userId, role } = decodeToken(token);

      socketInstance.on("connect", () => {
        const identificationData = { id: userId, role };
        socketInstance.emit("identify", identificationData);
      });

      setSocket(socketInstance);
      // Cleanup on unmount
      return () => {
        socketInstance.disconnect();
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
