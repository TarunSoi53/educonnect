// import { create } from 'zustand';
// import { io } from 'socket.io-client';
// import { useAuth } from './useAuthStore';

// const SocketContext = createContext();

// export const useSocket = () => useContext(SocketContext);

// export const SocketProvider = ({ children }) => {
//   const { token, isAuthenticated } = useAuth();
//   const [socket, setSocket] = useState(null);
//   const [connected, setConnected] = useState(false);

//   useEffect(() => {
//     let socketInstance = null;

//     // Only create socket if authenticated
//     if (isAuthenticated && token) {
//       // Create socket instance
//       socketInstance = io('/', {
//         auth: { token }
//       });

//       // Set up event listeners
//       socketInstance.on('connect', () => {
//         console.log('Socket connected');
//         setConnected(true);
//       });

//       socketInstance.on('disconnect', () => {
//         console.log('Socket disconnected');
//         setConnected(false);
//       });

//       socketInstance.on('error', (error) => {
//         console.error('Socket error:', error);
//       });

//       // Set the socket in state
//       setSocket(socketInstance);
//     }

//     // Cleanup on unmount
//     return () => {
//       if (socketInstance) {
//         console.log('Closing socket connection');
//         socketInstance.disconnect();
//       }
//     };
//   }, [isAuthenticated, token]);

//   // Join chat groups
//   const joinChatGroups = (groupIds) => {
//     if (socket && connected && groupIds.length > 0) {
//       socket.emit('joinGroups', groupIds);
//     }
//   };

//   // Send a message
//   const sendMessage = (groupId, content) => {
//     if (socket && connected) {
//       socket.emit('sendMessage', { groupId, content });
//     }
//   };

//   return (
//     <SocketContext.Provider
//       value={{
//         socket,
//         connected,
//         joinChatGroups,
//         sendMessage
//       }}
//     >
//       {children}
//     </SocketContext.Provider>
//   );
// };
