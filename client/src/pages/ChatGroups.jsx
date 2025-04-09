import React, { useState, useEffect, useContext } from 'react';
import {
    UserGroupIcon,
    ChatBubbleLeftRightIcon,
    PaperAirplaneIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';
import useAuthStore from '../store/useAuthStore';
import  SocketContext from '../store/socketContext';


// Sample SVG images for the empty chat state
const EmptyChatSVG1 = () => (
    <svg viewBox="0 0 150 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32 text-gray-400 animate-bounce">
        <path d="M75 10L95.33 45.33L140 45.33L104.33 70.67L124.67 106L75 80.67L25.33 106L45.67 70.67L10 45.33L54.67 45.33L75 10Z" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const EmptyChatSVGs = [EmptyChatSVG1];

const ChatGroups = () => {
    const [chatGroups, setChatGroups] = useState([]);
    const [selectedChatGroup, setSelectedChatGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [error, setError] = useState(null);

    // Replace with your actual API base URL
    const { socket, connected, joinChatGroups, sendMessage: sendSocketMessage } = useContext(SocketContext);
    const { user } = useAuthStore();
    // Axios instance with authorization header
   

    // Function to fetch chat groups
    const fetchChatGroups = async () => {
        setLoadingGroups(true);
        setError(null);
        try {
            const response = await api.get('/api/chat/groups');
            setChatGroups(response.data);
            setLoadingGroups(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch chat groups');
            setLoadingGroups(false);
        }
    };

    // Function to fetch messages for a specific group
    const fetchGroupMessages = async (groupId) => {
        if (!groupId) return;
        setLoadingMessages(true);
        setError(null);
        try {
            const response = await api.get(`/api/chat/groups/${groupId}/messages`);
            setMessages(response.data);
            setLoadingMessages(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch messages');
            setLoadingMessages(false);
            setMessages([]); // Clear messages on error
        }
    };

    // Function to send a new message
    const handleSendMessage = async () => {
    //     if (newMessage.trim() && selectedChatGroup &&  connected && socket) {
    //         try {
    //             console.log("selectedChatGroup",selectedChatGroup)
    //             const response = await api.post('/api/chat/messages', {
    //              groupId: selectedChatGroup._id,
    //               content : newMessage,
    //             }); 
    //             setMessages([...messages, response.data]); // Assuming the API returns the sent message
               
    //             sendSocketMessage(selectedChatGroup._id, newMessage);
    //         setNewMessage(''); 
    //             // Optionally, you might want to refetch messages to ensure consistency
    //             // fetchGroupMessages(selectedChatGroup.id);
    //         } catch (err) {
    //             setError(err.response?.data?.message || err.message || 'Failed to send message');
    //             // Handle error state for sending message
    //         }
    //     }
    // };
    if (newMessage.trim() && selectedChatGroup && connected && socket) {
        sendSocketMessage(selectedChatGroup._id, newMessage);
        setNewMessage('');
    }   
};

    // Function to handle adding a new group (you'll need a backend API endpoint for this)
    const handleAddNewGroup = async () => {
        const newGroupName = prompt('Enter new group name:');
        if (newGroupName && newGroupName.trim()) {
            try {
                const response = await api.post('/groups', { name: newGroupName });
                setChatGroups([...chatGroups, response.data]);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to create new group');
                // Handle error state for adding group
            }
        }
    };
    useEffect(() => {
        if (connected && socket && selectedChatGroup) {
            const handleNewMessage = (newMessage) => { // <-- Here is handleNewMessage
                console.log("Received new message via Socket:", newMessage);
                console.log("user data",user)
                const messageWithOwnership = {
                    ...newMessage,
                    isSentByMe: newMessage.senderId._id.toString() === user._doc._id.toString(),
                    
                  };
                if (newMessage.chatGroupId === selectedChatGroup._id) {
                    setMessages((prevMessages) => [...prevMessages, messageWithOwnership]);
                }
            };
    
            socket.on('newMessage', handleNewMessage);
    
            return () => {
                socket.off('newMessage', handleNewMessage);
            };
        }
    }, [connected, socket, selectedChatGroup, setMessages]);

    useEffect(() => {
        fetchChatGroups();
    }, []);
    useEffect(() => {
        // Join all available chat groups when the component mounts and when chatGroups are fetched
        if (connected && socket && chatGroups.length > 0) {
            const groupIds = chatGroups.map((group) => group._id);
            joinChatGroups(groupIds);
            console.log("Joining groups:", groupIds);
        }
    }, [connected, socket, chatGroups, joinChatGroups]); // Make sure joinChatGroups is in the dependency array

    useEffect(() => {
        if (selectedChatGroup) {
            fetchGroupMessages(selectedChatGroup._id);
        } else {
            setMessages([]);
        }
    }, [selectedChatGroup]);

    const handleGroupClick = (group) => {
        setSelectedChatGroup(group);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-100 flex">
                {/* Left Sidebar */}
                <aside className="bg-white w-72 border-r border-gray-200 shadow-sm p-4 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center mb-4">
                            <UserGroupIcon className="h-6 w-6 text-indigo-500 mr-2" />
                            <h2 className="text-lg font-semibold text-gray-800">Chat Groups</h2>
                        </div>
                        {loadingGroups ? (
                            <div className="text-center text-gray-500">Loading groups...</div>
                        ) : error ? (
                            <div className="text-red-500 text-sm">{error}</div>
                        ) : (
                            <nav className="space-y-2">
                                {chatGroups.map((group) => (
                                    <button
                                        key={group.id}
                                        onClick={() => handleGroupClick(group)}
                                        className={`group w-full rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                            selectedChatGroup?.id === group.id ? 'bg-indigo-50 text-indigo-700' : ''
                                        } transition duration-150 ease-in-out`}
                                    >
                                        <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 inline-block" />
                                        {group.name}
                                    </button>
                                ))}
                            </nav>
                        )}
                    </div>
                    <button
                        onClick={handleAddNewGroup}
                        className="group w-full rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                        <PlusIcon className="h-5 w-5 mr-2 inline-block" />
                        Add New Group
                    </button>
                </aside>

                {/* Right Chat Area */}
                <main className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
                    {selectedChatGroup ? (
                        <>
                            {/* Chat Header */}
                            <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800">{selectedChatGroup.name}</h3>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {loadingMessages ? (
                                    <div className="text-center text-gray-500">Loading messages...</div>
                                ) : error ? (
                                    <div className="text-red-500 text-sm">{error}</div>
                                ) : messages.length > 0 ? (
                                    messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${
                                                msg.isSentByMe ? 'justify-end' : 'justify-start'
                                            }`}
                                        >
                                            <div
                                                className={`rounded-lg px-2 py-1 text-black ${
                                                    msg.sender === 'You' ? 'bg-indigo-600' : 'bg-gray-300 text-gray-800'
                                                } shadow-sm max-w-xs`}
                                            >
                                                <span className="text-xs text-blue-400">{msg.senderId.name}</span>
                                                <p className="text-md mt-0.5">{msg.content}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        {EmptyChatSVGs[Math.floor(Math.random() * EmptyChatSVGs.length)]()}
                                        <p className="mt-4 text-gray-500 text-sm">No messages yet. Start the conversation!</p>
                                    </div>
                                )}
                            </div>

                            {/* Chat Input */}
                            <div className="bg-white border-t border-gray-200 p-4">
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        className="w-full rounded-full py-2 px-4 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(event) => {
                                            if (event.key === 'Enter') {
                                                handleSendMessage();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="absolute right-2 rounded-full p-2 bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                                    >
                                        <PaperAirplaneIcon className="h-5 w-5 rotate-45" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        // Empty Chat State
                        <div className="flex flex-col items-center justify-center h-full">
                            {EmptyChatSVGs[Math.floor(Math.random() * EmptyChatSVGs.length)]()}
                            <p className="mt-4 text-gray-500 text-sm">Select a chat group to start messaging.</p>
                        </div>
                    )}
                </main>
            </div>
        </DashboardLayout>
    );
};

export default ChatGroups;