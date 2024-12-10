import React from "react";
import "./styling/home-signed-in.css";
import ChargesTable from "./charges-table";
import GroupsPreview from "./groups-preview";
import Button from "./button";
import { useAuth } from "../AuthContext";

function HomeSignedChild() {
  const { user } = useAuth();
  return (
    <div className="home-content-signed">
      <div className="left-content">
        <div className="welcome-message">
          Welcome, {user?.displayName || user?.email || "CrewCut User"}
        </div>
        <div></div>
        <div className="charge-container">
          <h3> You are owed </h3>
          <ChargesTable action="Remind" />
          <h3> You owe </h3>
          <ChargesTable action="Pay" />
        </div>
      </div>
      <div className="right-content">
        <div className="create-btns-container">
          <Button href="/create-expense">Create Expense</Button>
          <Button href="/create-group">Create Group</Button>
        </div>
        <div className="groups-container">
          <GroupsPreview />
        </div>
      </div>
    </div>
  );
}

export default HomeSignedChild;
