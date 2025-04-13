import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

import useAuthStore from "./useAuthStore";

const SocketContext = createContext();
const BACKEND_SOCKET_URL = "http://localhost:5000";

// export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuthStore();
  console.log("token passing to the socket ", token);
  console.log("isAuthenticated passing to the socket ", isAuthenticated);
  console.log("SocketProvider token:", token);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let socketInstance = null;

    // Only create socket if authenticated
    if (isAuthenticated && token) {
      console.log("Creating socket instance with token:", token);
      // Create socket instance
      socketInstance = io(BACKEND_SOCKET_URL, {
        auth: { token },
      });
      console.log("Socket instance created:", socketInstance);

      // Set up event listeners
      socketInstance.on("connect", () => {
        console.log("Socket connected");
        setConnected(true);
      });

      socketInstance.on("disconnect", () => {
        console.log("Socket disconnected");
        setConnected(false);
      });

      socketInstance.on("error", (error) => {
        console.error("Socket error:", error);
      });

      // Set the socket in state
      setSocket(socketInstance);
    }

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        console.log("Closing socket connection");
        socketInstance.disconnect();
      }
    };
  }, [isAuthenticated, token]);

  // Join chat groups
  const joinChatGroups = (groupIds) => {
    if (socket && connected && groupIds.length > 0) {
      socket.emit("joinGroups", groupIds);
    }
  };

  // Send a message
  const sendMessage = (groupId, content) => {
    if (socket && connected) {
      socket.emit("sendMessage", { groupId, content });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        joinChatGroups,
        sendMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
export default SocketContext;
