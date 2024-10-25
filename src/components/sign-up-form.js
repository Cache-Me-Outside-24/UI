import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"; // Import Firebase Auth methods
import "./styling/sign-up-form.css";

const SignUpForm = ({ onSignUpSuccess }) => {
  // Accept onSignUpSuccess as a prop
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password } = formData;

    // Basic validation
    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    setError("");
    setLoading(true);

    const auth = getAuth();

    try {
      // Firebase sign up
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store the username in Firebase Auth profile
      await updateProfile(user, {
        displayName: username, // Store the username
      });

      // Make an API call to store the email in your database
      await fetch("http://localhost:8000/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_email: user.email, username: username }),
      });

      console.log("User signed up:", user);

      // Call the onSignUpSuccess prop to navigate after successful sign-up
      onSignUpSuccess();
    } catch (err) {
      setError(err.message); // Display any errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-form">
      <h1 className="welcome-msg">Welcome to Crewcut</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
