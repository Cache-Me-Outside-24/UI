import React, { useState, useEffect } from "react";
import { getAuth, updateProfile, updatePassword } from "firebase/auth";
import "./styling/settings.css";
import ProfilePicture from "./profile-picture";

function ProfileSettings() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const apiURL = process.env.REACT_APP_USER_SERVICE_API_BASE_URL;

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setUsername(user.displayName || "");
      setEmail(user.email || "");
      setProfilePhotoPreview(
        user.photoURL || "/assets/images/default_profile.png"
      );
    }
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    if (!username.trim()) {
      alert("Username cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const auth = getAuth();
      const user = auth.currentUser;

      // Upload photo to the backend if changed
      let photoUri = profilePhotoPreview;
      if (profilePhoto) {
        const formData = new FormData();
        formData.append("file", profilePhoto);
        formData.append("user_id", user.uid);

        const response = await fetch(`${apiURL}/upload-photo`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to upload photo");
        }

        const data = await response.json();
        photoUri = data.uri; // Update photoUri with the uploaded photo URL
      }

      // Update Firebase profile
      await updateProfile(user, {
        displayName: username,
        photoURL: photoUri,
      });

      // Update backend profile
      const response = await fetch(`${apiURL}/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.uid,
          username: username,
          profile_photo: photoUri,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update profile");
      }

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword.trim()) {
      alert("New password cannot be empty.");
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      await updatePassword(user, newPassword);

      alert("Password updated successfully!");
      setNewPassword("");
    } catch (err) {
      setError(err.message || "Failed to update password.");
    }
  };

  return (
    <div className="settings">
      <div className="personal-info">
        <div className="profile-picture-box">
          <ProfilePicture
            src={profilePhotoPreview}
            alt="Sample Photo"
            size={100}
          ></ProfilePicture>
          {isEditing && (
            <label className="photo-input">
              Upload Profile Photo
              <input type="file" onChange={handlePhotoChange} />
            </label>
          )}
        </div>
        <h4>Username</h4>
        {isEditing ? (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        ) : (
          <p>{username}</p>
        )}
        <h4>Email</h4>
        <p>{email}</p>
        {isEditing ? (
          <div>
            <button
              className="save-button"
              onClick={handleSaveProfile}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button className="save-button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
        {error && <p className="error">{error}</p>}
      </div>
      <hr className="solid-divider"></hr>
      <div className="password">
        <h4>Password</h4>
        <div className="password-box">
          <div>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
        <button className="save-button" onClick={handlePasswordChange}>
          Update Password
        </button>
      </div>
    </div>
  );
}

export default ProfileSettings;
