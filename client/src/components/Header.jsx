import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal"; // Import the modal component
import axiosInstance from "../utils/axiosInstance";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [isModalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/users/getUserDetails?userId=${userId}`
      );
      setUser(res.data);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Error fetching user details");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleProfileClick = () => {
    fetchUserDetails();
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <header className="bg-blue-600 text-white py-4 border-b-2 border-white">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold">Chat App</h1>
          <nav>
            {token ? (
              <>
                <button
                  onClick={handleProfileClick}
                  className="text-white mr-4"
                >
                  Profile
                </button>
                <button onClick={handleLogout} className="text-white">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="text-white mr-4">
                  Login
                </Link>
                <Link to="/signup" className="text-white">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      {isModalOpen && user && (
        <ProfileModal
          user={user}
          closeModal={closeModal}
          fetchUserDetails={fetchUserDetails}
        />
      )}
    </>
  );
};

export default Header;
