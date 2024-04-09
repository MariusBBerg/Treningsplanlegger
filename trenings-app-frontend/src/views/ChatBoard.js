// Import useEffect and useState
import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import axios from 'axios';
import { API_URL } from '../utils/api_url';

const ChatBoard = () => {
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [chatId, setChatId] = useState(null);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));

    const onError = (error) => {
        console.log("WebSocket Connection Error: ", error);
    };

    const onMessageReceived = (payload) => {
        const receivedMessage = JSON.parse(payload.body);
        console.log("Received message:", receivedMessage);
        setMessages(prevMessages => [...prevMessages, receivedMessage]);
    };

    const sendMessage = async (messageContent) => {
        if (!stompClient || !stompClient.connected) {
            console.error("WebSocket connection is not established yet");
            return;
        }   

        const message = {
            chatId: chatId,
            content: messageContent,
            userId: user.id,
        };

        try {
            await axios.post(`${API_URL}api/messages/create`, message, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            setMessages(prevMessages => [...prevMessages, message]);
            stompClient.send("/app/message", {}, JSON.stringify(message));
        } catch (error) {
            console.error("Error sending message", error);
        }

        setNewMessage(""); // Clear input field after sending message
    };

    useEffect(() => {
        const connectWebSocket = () => {
            const socket = new SockJS(API_URL + "ws");
            const stompClient = over(socket);
            const headers = { Authorization: `Bearer ${user.token}` };

            stompClient.connect(headers, () => {
                setIsConnected(true);
                console.log("WebSocket Connected");
                setStompClient(stompClient);
            }, onError);
        };

        connectWebSocket();

        return () => {
            if (stompClient) {
                stompClient.disconnect(() => {
                    console.log("WebSocket Disconnected");
                });
            }
        };
    }, []);

    useEffect(() => {
        if (isConnected && chatId && stompClient) {
            console.log(`Subscribing to /group/${chatId}`);
            const subscription = stompClient.subscribe(`/group/${chatId}`, onMessageReceived);

            return () => {
                console.log(`Unsubscribing from /group/${chatId}`);
                subscription.unsubscribe();
            };
        }
    }, [isConnected, chatId, stompClient]);

    const handleSendMessage = () => {
        sendMessage(newMessage);
        setNewMessage("");
    };

    const handleUserClick = async (userId) => {
        try {
            const requestBody = {
                userId: userId,
            };

            const response = await axios.post(`${API_URL}api/chats/single`, requestBody, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            const chatId = response.data.id;
            setChatId(chatId);

            const response2 = await axios.get(`${API_URL}api/messages/chat/${chatId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            setMessages(response2.data);
        } catch (error) {
            console.error("Error creating chat", error);
        }
    };

    const searchUsers = async (searchTerm) => {
        try {
            const response = await axios.get(`${API_URL}api/users/search`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                params: {
                    query: searchTerm,
                },
            });

            setUsers(response.data);
        } catch (error) {
            console.error("Error searching users", error);
        }
    };



    
    

    useEffect(() => {
        if (searchTerm) {
            searchUsers(searchTerm);
        } else {
            setUsers([]);
        }
    }, [searchTerm]);

    return (
        <div className="container">
            <h1>WebSocket Chat</h1>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
            />
            <div className="user-list">
                {/* Assuming users and handleUserClick are correctly implemented */}
                {users.map((otherUser) => (
                    <div key={otherUser.id} onClick={() => handleUserClick(otherUser.id)}>
                        {otherUser.firstName}
                    </div>
                ))}
            </div>
            <div className="message-container">
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        <span>{message.userId}: </span>
                        <span>{message.content}</span>
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatBoard;
