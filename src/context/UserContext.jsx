import { createContext, useState, useEffect } from "react";
import MidpointApi from "../services/api";  // Ensure this is the correct path

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      MidpointApi.token = storedUser.token;
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    MidpointApi.token = userData.token;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    MidpointApi.token = null;
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
