import React, { useState, useContext } from "react";
import { AppContext } from "../AppContext";
import { useNavigate } from "react-router-dom";
import "./styling/create-group-form.css";

function CreateGroupForm() {
  const { groups, setGroups } = useContext(AppContext);
  const [newGroupName, setNewGroupName] = useState("");
  const [newMember, setNewMember] = useState("");
  const [members, setMembers] = useState([]);
  const [groupPhoto, setGroupPhoto] = useState(null);
  const [groupPhotoPreview, setGroupPhotoPreview] = useState(
    "/assets/images/default_group.png" // Default group photo path
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiURL = process.env.REACT_APP_GROUP_SERVICE_API_BASE_URL;

  const navigate = useNavigate();

  const handleAddMember = (e) => {
    e.preventDefault();
    if (newMember.trim() !== "") {
      setMembers([...members, newMember.trim()]);
      setNewMember("");
    }
  };

  const handleRemoveMember = (email) => {
    setMembers(members.filter((member) => member !== email));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupPhoto(file);
      setGroupPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newGroupName.trim() === "" || members.length === 0) {
      alert("Group name and members are required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("name", newGroupName);
      formData.append("members", JSON.stringify(members));
      if (groupPhoto) {
        formData.append("group_photo", groupPhoto);
      }

      const response = await fetch(`${apiURL}/groups`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create group");
      }

      const createdGroup = await response.json();

      // Update frontend state
      const updatedGroups = [
        ...groups,
        {
          group_id: createdGroup.group_id,
          name: createdGroup.name,
          members: members,
          group_photo: createdGroup.group_photo,
        },
      ];
      setGroups(updatedGroups);

      // Reset form
      setNewGroupName("");
      setMembers([]);
      setGroupPhoto(null);

      // Navigate to the Groups page
      navigate("/groups", { state: { selectedGroup: createdGroup } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-group-form">
      <div className="create-group-header">Create New Group</div>
      <div className="header-line"></div>
      <div className="create-group-form-body">
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="photo-preview-container">
            <div className="group-photo-preview">
              <img
                src={groupPhotoPreview}
                alt="Group Preview"
                className={groupPhoto ? "uploaded-group-img" : "default-icon"}
              />
            </div>
          </div>
          <div className="photo-input">
            <label htmlFor="groupPhoto">Upload Group Photo</label>
            <input id="groupPhoto" type="file" onChange={handlePhotoChange} />
          </div>
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
            <label htmlFor="members">Add Group Members *</label>
            <div className="member-list">
              {members.map((email, index) => (
                <div key={index} className="member-item">
                  <div className="member-item-name">{email}</div>
                  <button
                    className="remove-member-btn"
                    onClick={() => handleRemoveMember(email)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            <div className="member-input-w-btn">
              <input
                id="members"
                type="email"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                placeholder="Enter group member's email address"
              />
              <button
                className="add-member-btn"
                onClick={handleAddMember}
                type="button"
              >
                +
              </button>
            </div>
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/groups")}
              className="cancel-button"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGroupForm;
