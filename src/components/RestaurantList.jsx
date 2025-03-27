import { useEffect, useState } from "react";
import axios from "axios";
import RestaurantCard from "./RestaurantCard";
import "../stylesheets/RestaurantList.css";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const RestaurantList = ({ midpoint, places, setPlaces }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!midpoint) return;

    const getPhotoUrl = (photoName, width) => `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&maxWidthPx=400&key=${API_KEY}`;

    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
            'https://places.googleapis.com/v1/places:searchNearby',
            {
              includedTypes: ['restaurant'],
              maxResultCount: 10,
              locationRestriction: {
                circle: {
                  center: {
                    latitude: midpoint.lat,
                    longitude: midpoint.lng,
                  },
                  radius: 8047, // 5 miles in meters
                },
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': API_KEY, 
                'X-Goog-FieldMask': 'places.id,places.location,places.displayName,places.rating,places.photos,places.formattedAddress',
              },
            }
        );

        // Process restaurants and add proper photo URLs
        const restaurantsWithPhotos = response.data.places.map(restaurant => ({
          ...restaurant,
          photoUrl: restaurant.photos?.[0]?.name 
            ? getPhotoUrl(restaurant.photos[0].name, 600) // Get better resolution (600px width)
            : "https://via.placeholder.com/150"
        }));

        setPlaces(restaurantsWithPhotos || []);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
      setLoading(false);
    };

    fetchRestaurants();
  }, [midpoint]);

  return (
    <div>
      <h2>Restaurants Near Midpoint</h2>
      {loading && <p>Loading...</p>}
      {places.length === 0 && !loading && <p>No places found.<br /> Enter two addresses to get started!</p>}
      <div className="restaurant-list">
        {places.map((place) => (
          <RestaurantCard key={place.id} restaurant={place} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;