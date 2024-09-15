import React, { useState } from "react";
import "./UserModal.css";

const UserModal = ({ users, currentUserId, onUserSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users
    .filter((user) => user.id !== currentUserId)
    .filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-button">
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Select a User</h2>

        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <ul className="space-y-2">
          {filteredUsers.length === 0 && <p>No users found.</p>}
          {filteredUsers.map((user) => (
            <li key={user.id} className="border-b border-gray-300">
              <button
                onClick={() => {
                  onUserSelect(user.id, user.name);
                  onClose();
                }}
                className="block p-2 w-full text-left hover:bg-gray-100"
              >
                <h3 className="font-medium">{user.name}</h3>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserModal;
