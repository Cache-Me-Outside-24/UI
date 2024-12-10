import React, { useState, useContext } from "react";
import { AppContext } from "../AppContext";
import { useNavigate } from "react-router-dom";
import "./styling/create-group-form.css";

function CreateGroupForm() {
  const { groups, setGroups } = useContext(AppContext);
  const [newGroupName, setNewGroupName] = useState("");
  const [newMember, setNewMember] = useState("");
  const [members, setMembers] = useState([]);
  const [groupPhoto, setGroupPhoto] = useState(null); // New state for group photo
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
    setGroupPhoto(e.target.files[0]); // Save the selected file
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

      let photoUri = null;

      // If no image is uploaded, use the default image
      let photoFile = groupPhoto;
      if (!photoFile) {
        photoFile = new File(
          [
            await fetch("/assets/images/default_profile.png").then((res) =>
              res.blob()
            ),
          ],
          "default_profile.png",
          { type: "image/png" }
        );
      }

      // Upload the photo to GCP
      const formData = new FormData();
      formData.append("file", photoFile);

      const uploadResponse = await fetch(`${apiURL}/upload-photo`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.detail || "Failed to upload photo");
      }

      const uploadData = await uploadResponse.json();
      photoUri = uploadData.uri; // Get the URI from the response

      // Send group creation data to the backend
      const response = await fetch(`${apiURL}/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newGroupName,
          members,
          group_photo: photoUri,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create group");
      }

      const createdGroup = await response.json();

      // Add the created group to the frontend state
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
      {error && <div className="error">{error}</div>}
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

        <div className="photo-input">
          <label htmlFor="groupPhoto">Upload Group Photo</label>
          <input id="groupPhoto" type="file" onChange={handlePhotoChange} />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default CreateGroupForm;
