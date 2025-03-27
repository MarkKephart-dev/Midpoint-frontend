import React, { useState, useMemo } from "react";
import AutocompleteSearch from "./AutocompleteSearch";
import RestaurantList from "./RestaurantList";
import MidpointMap from "./MidpointMap";
import '../stylesheets/Home.css';

const Home = () => {
    const [places, setPlaces] = useState([]);
    const [coordinatesA, setCoordinatesA] = useState(null);
    const [coordinatesB, setCoordinatesB] = useState(null);

    const midpoint = useMemo(() => {
        if (coordinatesA && coordinatesB) {
            const midLat = (coordinatesA.lat + coordinatesB.lat) / 2;
            const midLng = (coordinatesA.lng + coordinatesB.lng) / 2;
            return { lat: midLat, lng: midLng };
        }
        return null;
    }, [coordinatesA, coordinatesB]); // Recalculate when coordinates change

    return (
        <div className="home-container">
            {/* Left Section - Addresses & Map */}
            <div className="left-section">
                <h1>Find a Meeting Point</h1>

                <div className="address-container">
                <h3>Address for You</h3>
                <AutocompleteSearch onPlaceChanged={setCoordinatesA} />
                </div>

                <div className="address-container">
                <h3>Address for Them</h3>
                <AutocompleteSearch onPlaceChanged={setCoordinatesB} />
                </div>

                {midpoint && (
                <div className="midpoint-container">
                    <h3>Midpoint:</h3>
                    <p>{midpoint.lat}, {midpoint.lng}</p>
                </div>
                )}

                <div className="map-container">
                    <MidpointMap midpoint={midpoint} places={places} />
                </div>
            </div>

            {/* Right Section - Restaurant List */}
            <div className="right-section">
                <RestaurantList midpoint={midpoint} places={places} setPlaces={setPlaces} />
            </div>
        </div>
    );
}

export default Home;