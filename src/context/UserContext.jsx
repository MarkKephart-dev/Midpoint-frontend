import { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import MidpointApi from "../services/api";  // Ensure this is the correct path

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      MidpointApi.token = storedUser.token;
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
    MidpointApi.token = userData.token;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    MidpointApi.token = null;
    navigate("/login");
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
