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
        <div className="subheader">
          Recent Activity
          <div className="subheader-line"></div>
        </div>
        <div className="charge-container">
          <h3> You are owed </h3>
          <ChargesTable action="Remind" view="home"/>
          <h3> You owe </h3>
          <ChargesTable action="Pay" view="home"/>
        </div>
      </div>
      <div className="right-content">
        <div className="create-btns-container">
          <div className="add-btn-container">
            <Button
              href="/create-expense"
              className="add-btn"
              id="create-expense-btn"
            >
              +
            </Button>
            <div className="btn-label">Create Expense</div>
          </div>
          <div className="add-btn-container">
            <Button
              href="/create-group"
              className="add-btn"
              id="create-group-btn"
            >
              +
            </Button>
            <div className="btn-label">Create Group</div>
          </div>
        </div>
        <div className="groups-container">
          <div className="subheader">
            My Groups
            <div className="subheader-line"></div>
          </div>
          <GroupsPreview />
        </div>
      </div>
    </div>
  );
}

export default HomeSignedChild;
