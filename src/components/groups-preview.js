import React, { useEffect, useState } from "react";
import "./styling/groups-preview.css";
import { AppContext } from "../AppContext";
import { fetchGroups } from "../api/groupApi";

function GroupsPreview() {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGroups() {
      try {
        setLoading(true);
        const data = await fetchGroups();
        setGroups(data.data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadGroups();
  }, []);

  if (loading) return <p>Loading groups...</p>;
  if (error) return <p>Error loading groups: {error}</p>;

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
