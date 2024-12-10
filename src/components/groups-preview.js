import React, { useEffect, useState, useContext } from "react";
import "./styling/groups-preview.css";
import { AppContext } from "../AppContext";
import { fetchGroups } from "../api/groupApi";

function GroupsPreview() {
  const { groups, setGroups } = useContext(AppContext);

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
            <tr key={index}>
              <td className="td">{group.name}</td>
              <td className="td">{group.members.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GroupsPreview;
