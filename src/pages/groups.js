import React, { useState } from "react";
import Header from "../components/header";
import GroupsList from "../components/groups-list";
import GroupDetail from "../components/group-detail";
import "../styling/groups.css";

function Groups() {
  const [selectedGroup, setSelectedGroup] = useState(null);

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
