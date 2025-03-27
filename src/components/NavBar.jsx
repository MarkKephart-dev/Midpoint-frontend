import { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../context/UserContext";
import '../stylesheets/NavBar.css';

const NavBar = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Midpoint Meetup</Link>
      <div className="navLinks">
        {user ? (
          <>
            <Link to="/locations" className="link">Locations</Link>
            <Link to="/profile" className="link">{user.username}'s Profile</Link>
            <button onClick={logout} className="logoutButton">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="link">Login</Link>
            <Link to="/signup" className="signupButton">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;