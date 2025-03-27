import "../stylesheets/RestaurantCard.css";
import { useContext } from "react";
import UserContext from "../context/UserContext";
import { useState } from "react";
import MidpointApi from "../services/api";

const RestaurantCard = ({ restaurant }) => {
  const { user } = useContext(UserContext);
  const [error, setError] = useState(null);

  const [saving, setSaving] = useState(false);
  const [locationName, setLocationName] = useState("");

  const handleSaveClick = () => setSaving(true);

  const handleSaveLocation = async () => {
    if (!locationName || !user?.id) {
      setError("Please log in to save locations.");
      return;
    };
    try {
      await MidpointApi.saveLocation({
        userId: user.id,
        name: locationName,
        address: restaurant.formattedAddress,
      });
      setSaving(false);
      setLocationName("");
      alert("Location saved!");
    } catch (error) {
      console.error("Error saving location:", error);
      setError("Failed to save location.");
    }
  };

    return (
      <div className="restaurant-card">
        <img
          src={restaurant.photoUrl} 
          alt={restaurant.displayName?.text || "Restaurant"}
          className="restaurant-image"
        />
        <div className="restaurant-info">
          <h3>{restaurant.displayName?.text}</h3>
          <p className="restaurant-rating">
            {restaurant.rating ? `Rating: ⭐ ${restaurant.rating}` : "No rating"}
          </p>
          <p>{restaurant.formattedAddress || "No address available"}</p>
          {!saving ? (
            <button onClick={handleSaveClick}>Save</button>
          ) : (
            <div>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Enter name (e.g., Home, Favorite Cafe)"
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button onClick={handleSaveLocation}>Confirm</button>
            </div>
          )}
        </div>
        
      </div>
    );
  };
  
  export default RestaurantCard;