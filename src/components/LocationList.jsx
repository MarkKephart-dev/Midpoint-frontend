import { useEffect, useState, useContext, useCallback } from "react";
import UserContext from "../context/UserContext";
import MidpointApi from "../services/api";
import LocationItem from "./LocationItem";
import "../stylesheets/Locations.css";

const LocationList = () => {
  const { user } = useContext(UserContext);
  const [locations, setLocations] = useState([]);

  const fetchLocations = useCallback(async () => {
    try {
      const res = await MidpointApi.getLocations();
      setLocations(res);
    } catch (err) {
      console.error("Error fetching locations", err);
    }
  }, []);

  useEffect(() => {
    if (user) fetchLocations();
  }, [user, fetchLocations]);

  const handleRemoveLocation = async (locationId) => {
    try {
      await MidpointApi.removeLocation(locationId);
      setLocations((prevLocations) => prevLocations.filter((loc) => loc.id !== locationId));
    } catch (error) {
      console.error("Error removing location:", error);
    }
  };

  const handleEditLocation = async (locationId, newName) => {
    try {
      const updatedLocation = await MidpointApi.editLocationName(locationId, newName);
      setLocations((prevLocations) =>
        prevLocations.map((loc) =>
          loc.id === locationId ? { ...loc, name: updatedLocation.name } : loc
        )
      );
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
          <LocationItem
            key={location.id}
            location={location}
            onRemove={handleRemoveLocation}
            onEdit={handleEditLocation}
          />
        ))}
      </ul>
    </div>
  );
};

export default LocationList;