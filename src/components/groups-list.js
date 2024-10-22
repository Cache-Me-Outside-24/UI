import React, { useContext } from "react";
import "./styling/groups-list.css";
import { AppContext } from "../AppContext";

// currently identical to groupsPreview
// TODO: either change groupslist on groups page or find way to use same component for both
function GroupsList({ onSelectGroup }) {
  // TODO: REPLACE WITH API GET
  const { groups } = useContext(AppContext);

  return (
    <div className="groups-preview-container">
      <table className="table">
        <thead className="thead">
          <tr>
            <th className="th">Group Name</th>
            <th className="th">Members</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group, index) => (
            <tr key={index} onClick={() => onSelectGroup(group)}>
              <td className="td">{group.name}</td>
              <td className="td">{group.members.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GroupsList;
