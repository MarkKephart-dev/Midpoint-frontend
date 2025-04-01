import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import MidpointApi from "../services/api";
import '../stylesheets/Form.css';

const SignupForm = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [error, setError] = useState(null);

  const validateForm = () => {
    const { username, password, email } = formData;
    if (username.length < 6) return "Username must be at least 6 characters.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format.";

    return null; // No errors
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    try {
      const response = await MidpointApi.signup(formData);
      const { user, token } = response;
      login({ username: user.username, token, id: user.id });
      navigate("/");
    } catch (err) {
      if (Array.isArray(err)) {
        setError(err.join(", "));
      } else if (err && err.message) {
        // If it's an Error object, use the message property
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
            <label htmlFor="username" className="form-label">Username: </label>
            <input 
                id="username" 
                name="username" 
                placeholder="Username" 
                onChange={handleChange} 
                required
                autoComplete="username"
                className="form-input"
            />
        </div>
        
        <div className="form-group">
            <label htmlFor="email" className="form-label">Email: </label>
            <input 
                id="email" 
                name="email"
                placeholder="Email" 
                onChange={handleChange} 
                required 
                autoComplete="email"
                className="form-input"
            />
        </div>
        
        <div className="form-group">
            <label htmlFor="password" className="form-label">Password: </label>
            <input 
                id="password" 
                type="password" 
                name="password" 
                placeholder="Password" 
                onChange={handleChange} 
                required 
                autoComplete="current-password"
                className="form-input"
            />
        </div>
        <button type="submit" className="form-button">Sign Up</button>
      </form>

    </div>
  );
};

export default SignupForm;