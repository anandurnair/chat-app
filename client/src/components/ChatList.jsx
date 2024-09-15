import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import UserModal from "./UserModal";
import axiosInstance from "../utils/axiosInstance";
import { IoIosArrowBack } from "react-icons/io";

const ChatList = ({ onUserSelect }) => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [onlineUsers, setOnlineUsers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("update-status", ({ userId, status }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: status }));
    });

    const fetchChatUsers = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/messages/users/${userId}`
        );
        setChatUsers(response.data);
      } catch (error) {
        console.error("Error fetching chat users:", error);
      }
    };

    const fetchAllUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/users");
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    fetchChatUsers();
    fetchAllUsers();

    socket.emit("online", userId);

    return () => {
      socket.emit("offline", userId);
      socket.off("update-status");
      socket.disconnect();
    };
  }, [userId]);

  const handleUserSelect = (userId, userName) => {
    const selectedUser = { id: userId, name: userName };

    const userExists = chatUsers.find((user) => user.id === userId);

    if (!userExists) {
      setChatUsers([...chatUsers, selectedUser]);
    }
    onUserSelect(userId, userName);
    setShowModal(false);
  };

  return (
    <div className="bg-white p-4 border-r border-gray-200 w-2/6">
      <div className="flex justify-between">
        <div className="flex justify-center">
          <p
            onClick={() => {
              onUserSelect(null, null);
              navigate("/home");
            }}
            className="mt-1 mr-1 hover:cursor-pointer"
          >
            <IoIosArrowBack size={24} />
          </p>
          <h2 className="text-xl font-semibold mb-4">Chats</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white p-2 rounded mb-4 "
        >
          Add Chat
        </button>
      </div>

      <ul className="space-y-2">
        {chatUsers.map((user) => (
          <li
            key={user.id}
            className="border-b border-gray-300"
            onClick={() => onUserSelect(user.id, user.name)}
          >
            <Link
              to={`/chat/${user.id}`}
              className="block p-2 hover:bg-gray-100"
            >
              <h3 className="font-medium">{user.name}</h3>
              <p
                className={`text-sm ${
                  onlineUsers[user.id] ? "text-green-600" : "text-gray-600"
                }`}
              >
                {onlineUsers[user.id] ? "Online" : "Offline"}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {showModal && (
        <UserModal
          users={allUsers}
          currentUserId={userId}
          onUserSelect={handleUserSelect}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ChatList;
