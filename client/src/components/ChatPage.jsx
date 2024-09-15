import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const ChatPage = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io("http://localhost:5000");
    setSocket(socketInstance);

    const userId = String(localStorage.getItem("userId"));
    socketInstance.emit("online", userId);

    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/messages/getMessages/${chatId}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    socketInstance.on("receive-message", (message) => {
      console.log("Received message:", message);
      console.log("Chat Id : ", chatId);
      if (message.receiver_id == userId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socketInstance.emit("offline", userId);
      socketInstance.off("receive-message");
      socketInstance.disconnect();
    };
  }, [chatId]);

  const handleSendMessage = async (message) => {
    const userId = String(localStorage.getItem("userId"));
    const newMessage = { message, sender_id: userId, receiver_id: chatId };
    try {
      await axiosInstance.post("/api/messages/sendMessage", newMessage);
      socket.emit("send-message", { chatId, message: newMessage });
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  const handleUserSelect = (userId, userName) => {
    setSelectedUser({ userId, userName });
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex h-full">
        <ChatList onUserSelect={handleUserSelect} />

        {selectedUser && (
          <div className="w-full flex flex-col h-full">
            <header className="bg-blue-600 text-white p-4">
              <h1 className="text-2xl font-bold">
                Chat with{" "}
                {selectedUser ? selectedUser.userName : "Select a User"}
              </h1>
            </header>

            <ChatWindow messages={messages} />
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
