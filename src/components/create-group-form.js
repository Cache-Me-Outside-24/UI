import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../AppContext";
import { useNavigate } from "react-router-dom";
import "./styling/create-group-form.css";
import { useAuth } from "../AuthContext";

function CreateGroupForm({ hideHeader, hideButtons }) {
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
  const { user } = useAuth();

  const apiURL = process.env.REACT_APP_GROUP_SERVICE_API_BASE_URL;
  const userapiURL = process.env.REACT_APP_USER_SERVICE_API_BASE_URL;

  const navigate = useNavigate();

  useEffect(() => {
    // Automatically add the current user's email
    if (user?.email && !members.includes(user.email)) {
      setMembers([user.email]);
    }
  }, [user, members]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (newMember.trim() !== "") {
      try {
        const response = await fetch(
          `${userapiURL}/email-exists?email=${newMember}`
        );
        const data = await response.json();
        if (!data.exists) {
          setError(`The email ${newMember} does not exist.`);
          return;
        }

        setMembers([...members, newMember.trim()]);
        setNewMember("");
      } catch (err) {
        setError("Error verifying email.");
      }
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

      let uploadedPhotoUri =
        "https://cdn-icons-png.freepik.com/512/10017/10017806.png";

      // Upload the photo if it exists
      if (groupPhoto) {
        const formData = new FormData();
        formData.append("file", groupPhoto);

        const uploadResponse = await fetch(`${apiURL}/upload-photo`, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.detail || "Failed to upload photo");
        }

        const uploadData = await uploadResponse.json();
        uploadedPhotoUri = uploadData.uri; // Get the uploaded photo URI
      }

      // Make a call to create group
      const response = await fetch(`${apiURL}/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newGroupName,
          members: members,
          group_photo: uploadedPhotoUri, // Pass the URI from the uploaded photo
        }),
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
          group_photo: uploadedPhotoUri,
        },
      ];
      setGroups(updatedGroups);

      // Reset form
      setNewGroupName("");
      setMembers([]);
      setGroupPhoto(null);
      setGroupPhotoPreview("/assets/images/default_group.png");

      // Navigate to the Groups page
      navigate("/groups");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-group-form">
      <div>
        {!hideHeader && (
          <div className="create-group-header"> Create New Group</div>
        )}
      </div>
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
            {!hideButtons && (
              <button
                type="button"
                onClick={() => navigate("/groups")}
                className="cancel-button"
              >
                Cancel
              </button>
            )}
            {!hideButtons && (
              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? "Creating..." : "Create Group"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGroupForm;
