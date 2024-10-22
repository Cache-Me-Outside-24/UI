import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Button from "./button";
import "./styling/header.css";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignedIn] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="header-container">
      <Link to="/" className="team-name">
        CREW-CUT
      </Link>

      <div className="header-nav">
        <Link to="/groups">My Groups</Link>
        <Link to="/balances">My Balances</Link>
      </div>

      {isSignedIn ? (
        <div className="signed-in-component">
          <FaUserCircle
            size={40}
            color="#EE6123"
            onClick={toggleDropdown}
            className="profile-icon"
          />

          {isOpen && (
            <div className="dropdown-menu">
              <Link to="/profile">Profile</Link>
              <Link to="/settings">Settings</Link>
              <Link to="/logout">Logout</Link>
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
