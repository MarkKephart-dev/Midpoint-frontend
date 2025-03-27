import { GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect, useRef } from "react";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = { lat: 39.8283, lng: -98.5795 }; // Default center

const MidpointMap = ({ midpoint, places }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null); // Ref for AdvancedMarkerElement

  useEffect(() => {
    if (mapRef.current && midpoint) {
      // Pan and zoom to the new midpoint
      mapRef.current.panTo(midpoint);
      mapRef.current.setZoom(11); // Adjust zoom as needed

      // Ensure Google Maps API is available
      if (window.google && window.google.maps && window.google.maps.marker) {
        // Remove the old marker if it exists
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        // Create a new AdvancedMarkerElement
        markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
          position: midpoint,
          map: mapRef.current,
        });
      }
    }
  }, [midpoint]);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      mapId="8bce62663b002618"
      zoom={5}
      center={midpoint || center} // Update center to midpoint or default
      options={{
        mapId: "8bce62663b002618", // Explicitly setting it in options
      }}
      onLoad={(map) => { mapRef.current = map; }} // Save map reference
    >
        {places.map((place, index) => {
            const { latitude, longitude } = place.location; // Access lat and lng from geometry.location

            return (
            <Marker
                key={place.id} // Unique key for each restaurant
                position={{
                    lat: latitude,
                    lng: longitude,
                }}
                title={place.displayName?.text}
            />
            );
        })}
    </GoogleMap>
  );
};

export default MidpointMap;