import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Button from "./button";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; // Import Firebase Auth
import "./styling/header.css";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false); // Update based on Firebase Auth state
  const navigate = useNavigate(); // To navigate to /login after logout
  const auth = getAuth();

  useEffect(() => {
    // Set up Firebase listener to track auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user); // Set isSignedIn to true if user is signed in, false otherwise
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [auth]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to /login after signing out
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="header-container">
      <Link to="/" className="team-name">
        CREW-CUT
      </Link>

      {isSignedIn ? (
        <div className="signed-in-component">
          <div className="header-nav">
            <Link to="/groups">My Groups</Link>
            <Link to="/balances">My Balances</Link>
            <Link to="/payments">My Payments</Link>
          </div>
          <FaUserCircle
            size={40}
            color="#EE6123"
            onClick={toggleDropdown}
            className="profile-icon"
          />

          {isOpen && (
            <div className="dropdown-menu">
              <Link to="/account">Account</Link>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="signed-out-component">
          <Button href="/sign-up" className="sign-up-button">
            Sign Up
          </Button>
          <Button href="/login" className="log-in-button">
            Log In
          </Button>
        </div>
      )}
    </div>
  );
}

export default Header;
