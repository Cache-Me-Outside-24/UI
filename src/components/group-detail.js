import React, { useContext } from "react";
import "./styling/groups-list.css";
import { AppContext } from "../AppContext";

// currently identical to groupsPreview
// TODO: either change groupslist on groups page or find way to use same component for both
function GroupDetail({ selectedGroup }) {
  // TODO: REPLACE WITH API GET
  const { groups } = useContext(AppContext);

  if (!selectedGroup) return <div>Please select a group</div>;

  return (
    <div className="detailed-group-view">
      <h2>{selectedGroup.name}</h2>
      <p>Members: {selectedGroup.members.join(", ")}</p>
      {/* Display more detailed info about the group */}
    </div>
  );
}

export default GroupDetail;
