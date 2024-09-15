import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer";

const HomePage = () => {
  const navigate = useNavigate();
  let token = localStorage.getItem("token");
  console.log("token", token);
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Chat App</h1>
          <p className="text-lg mb-6">
            Connect with your friends and colleagues. Send and receive messages
            instantly, and stay updated with real-time notifications.
          </p>
          <Link
            to="/chat"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Start Chatting
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
