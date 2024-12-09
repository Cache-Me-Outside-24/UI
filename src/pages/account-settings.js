import React from "react";
import Header from "../components/header";
import Settings from "../components/settings";
import "../styling/settings-container.css"; 

function AccountSettings() {
  return (
    <div className="settings-container">
      <Header />
      <Settings />
    </div>
  );
}

export default AccountSettings;
