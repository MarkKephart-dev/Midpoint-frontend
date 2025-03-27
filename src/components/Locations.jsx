import { useEffect, useState, useContext } from "react";
import UserContext from "../context/UserContext";
import MidpointApi from "../services/api";
import '../stylesheets/Locations.css';

const Locations = () => {
  const { user } = useContext(UserContext);
  const [locations, setLocations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await MidpointApi.getLocations();
        setLocations(res);
      } catch (err) {
        console.error("Error fetching locations", err);
      }
    };
    
    if (user) fetchLocations();
  }, [user]);

  const handleRemoveLocation = async (locationId) => {
    try {
      await MidpointApi.removeLocation(locationId);
      setLocations(locations.filter((loc) => loc.id !== locationId));
    } catch (error) {
      console.error("Error removing location:", error);
      setError("Failed to remove location.");
    }
  };

  const handleEdit = async (locationId) => {
    try {
      const updatedLocation = await MidpointApi.editLocationName(locationId, newName);
      setLocations((locations) =>
        locations.map((loc) =>
          loc.id === locationId ? { ...loc, name: updatedLocation.name } : loc
        )
      );
      setEditingId(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  if (!user) return <p>You must be logged in to view saved locations.</p>;

  return (
    <div className="locations-container">
      <h2>Your Saved Locations:</h2>
        <ul className="locations-list">
          {locations.map((location) => (
            <li key={location.id}>
              {editingId === location.id ? (
                <>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  <button onClick={() => handleEdit(location.id)} className="save-btn">Save</button>
                  <button onClick={() => setEditingId(null)} className="cancel-btn">Cancel</button>
                </>
              ) : (
                <>
                  <span className="location-info">{location.name} - {location.address}</span>
                  <div className="location-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditingId(location.id);
                        setNewName(location.name);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveLocation(location.id)}
                    >
                      Remove
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
    </div>
    
  );
};

export default Locations;
