import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router
import LogInForm from "../components/login-form";
import Header from "../components/header";
import "../styling/login.css";

function LogIn() {
  const navigate = useNavigate(); // Initialize the navigate function

  // Define the login success handler to navigate to home ("/") after login
  const handleLoginSuccess = () => {
    navigate("/"); // Navigate to home after successful login
  };

  return (
    <div className="login-page">
      <Header />
      <div className="login-container">
        {/* Pass handleLoginSuccess as a prop to LogInForm */}
        <LogInForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}

export default LogIn;
