import React, { useState, useEffect } from "react";
import Header from "../components/header";
import GroupsList from "../components/groups-list";
import GroupDetail from "../components/group-detail";
import "../styling/groups.css";
import { useLocation } from "react-router-dom";

function Groups() {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const location = useLocation();

  useEffect(() => {
    // Check if a selectedGroup is passed via navigation state
    if (location.state && location.state.selectedGroup) {
      console.log("hre")
      setSelectedGroup(location.state.selectedGroup);
    }
  }, [location.state]);

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
  };

  return (
    <div className="groups-page">
      <Header />
      <div className="groups-preview">
        <GroupsList onSelectGroup={handleGroupSelect} />
      </div>
      <div className="group-detail">
        <GroupDetail selectedGroup={selectedGroup} />
      </div>
    </div>
  );
}

export default Groups;
