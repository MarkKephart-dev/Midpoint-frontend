import React, { useState, useEffect, useContext } from "react";
import UserContext from "../context/UserContext"; // Assuming you're using UserContext for managing user state
import { useNavigate } from "react-router-dom";
import MidpointApi from "../services/api"; // Assuming MidpointApi handles API requests
import "../stylesheets/Form.css";

const Profile = () => {
  const { user, setUser } = useContext(UserContext); // Assuming you're storing user in context
  const navigate = useNavigate();
  
  // State for form fields
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value,
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await MidpointApi.updateProfile(user.username, { email: formData.email });
      console.log("Updated user:", updatedUser);
      setUser(updatedUser);
      console.log("User updated in context:", user); 
      navigate("/");
      console.log("after navigate");
    } catch (err) {
      setError("An error occurred while updating the profile.");
    }
  };

  // Render loading state or profile form based on user data availability
  if (!user) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not logged in</div>; // Handle case if there's no user data
  }

  return (
    <div>
      <h2>Edit Profile</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="username" className="form-label">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default Profile;