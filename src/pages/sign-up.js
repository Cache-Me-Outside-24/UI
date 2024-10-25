import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import SignUpForm from "../components/sign-up-form";
import Header from "../components/header";
import "../styling/sign-up.css";

function SignUp() {
  const navigate = useNavigate(); // Initialize navigate

  // Handle sign-up success by navigating to the home page
  const handleSignUpSuccess = () => {
    navigate("/"); // Navigate to home after successful sign-up
  };

  return (
    <div className="signup-page">
      <Header />
      <div className="signup-container">
        <SignUpForm onSignUpSuccess={handleSignUpSuccess} />{" "}
        {/* Pass handleSignUpSuccess as a prop */}
      </div>
    </div>
  );
}

export default SignUp;
