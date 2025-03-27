import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import { useLoadScript } from "@react-google-maps/api";
import { APIProvider } from "@vis.gl/react-google-maps";
import NavBar from "./components/NavBar";
import Locations from "./components/Locations";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import { UserProvider } from "./context/UserContext";
import ProfileForm from "./components/ProfileForm";

const libraries = ["places", "marker"]; // Defined once outside to prevent reloading issues
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries,
    version: "weekly",
  });

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading...</p>;

  return (
    <APIProvider apiKey={API_KEY}>
      <Router>
        <UserProvider>
          <NavBar />
          <Routes>
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/profile" element={<ProfileForm />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </UserProvider>
      </Router>
    </APIProvider>
  );
}

export default App;
