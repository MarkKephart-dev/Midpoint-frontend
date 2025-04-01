import { useState } from "react";
import "../stylesheets/Locations.css";

const LocationItem = ({ location, onRemove, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(location.name);

  const handleSave = () => {
    onEdit(location.id, newName);
    setIsEditing(false);
  };

  return (
    <li className="location-item">
      {isEditing ? (
        <>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button onClick={handleSave} className="save-btn">Save</button>
          <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
        </>
      ) : (
        <>
          <span className="location-info">{location.name} - {location.address}</span>
          <div className="location-buttons">
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="remove-btn" onClick={() => onRemove(location.id)}>Remove</button>
          </div>
        </>
      )}
    </li>
  );
};

export default LocationItem;
