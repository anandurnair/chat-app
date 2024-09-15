import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const ProfileModal = ({ user, closeModal, fetchUserDetails }) => {
  const [editingUser, setEditingUser] = useState(user || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = async () => {
    try {
      await axiosInstance.patch(
        `/api/users/updateUser/${user?.id}`,
        editingUser
      );
      await fetchUserDetails();
      alert("Profile updated successfully!");
      closeModal();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Error updating profile");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/users/deleteUser/${user?.id}`);
      alert("Profile deleted successfully!");
      closeModal();
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Error deleting profile");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        {user ? (
          <div>
            <label>
              <strong>Name:</strong>
              <input
                type="text"
                name="name"
                value={editingUser.name || ""}
                onChange={handleChange}
                className="border p-1 w-full mt-1"
              />
            </label>
            <label>
              <strong>Email:</strong>
              <input
                type="email"
                name="email"
                value={editingUser.email || ""}
                onChange={handleChange}
                className="border p-1 w-full mt-1"
                disabled
              />
            </label>
            <label>
              <strong>Phone:</strong>
              <input
                type="text"
                name="phone"
                value={editingUser.phone || ""}
                onChange={handleChange}
                className="border p-1 w-full mt-1"
              />
            </label>
            <label>
              <strong>Role:</strong>
              <input
                type="text"
                name="role"
                value={editingUser.role || ""}
                onChange={handleChange}
                className="border p-1 w-full mt-1"
                disabled
              />
            </label>
          </div>
        ) : (
          <p>Loading user details...</p>
        )}
        <div className="mt-4 flex justify-between">
          <button
            onClick={handleEdit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
