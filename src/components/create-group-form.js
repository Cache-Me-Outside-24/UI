import React, { useState, useContext } from "react";
import { AppContext } from "../AppContext";
import { useNavigate } from "react-router-dom";
import "./styling/create-group-form.css";

function CreateGroupForm() {
  const { groups, setGroups } = useContext(AppContext);
  const [newGroupName, setNewGroupName] = useState("");
  const [newMember, setNewMember] = useState("");
  const [members, setMembers] = useState([]);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (newMember.trim() !== "") {
      // TODO: REPLACE WITH API POST
      setMembers([...members, newMember.trim()]);
      setNewMember("");
    }
  };

  const handleRemoveMember = (email) => {
    setMembers(members.filter((member) => member !== email));
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newGroupName.trim() === "" || members.length === 0) {
      alert("Group name and members are required.");
      return;
    }

    const newGroup = { name: newGroupName, members: members };
    setGroups([...groups, newGroup]);

    setNewGroupName("");
    setMembers([]);

    navigate("/groups", { state: { newGroup } });
  };

  return (
    <div className="create-group-form">
      <div className="create-group-header">Create New Group</div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="groupName">Group Name *</label>
        <input
          id="groupName"
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Enter a group name"
          required
        />

        <div className="member-input">
          <label htmlFor="members">Add Members</label>
          <input
            id="members"
            type="email"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="Enter email address"
          />
          <button onClick={handleAddMember} type="button">
            Add Member
          </button>
        </div>

        <div className="member-list">
          {members.map((email, index) => (
            <div key={index} className="member-item">
              {email}
              <button onClick={() => handleRemoveMember(email)}>X</button>
            </div>
          ))}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreateGroupForm;
