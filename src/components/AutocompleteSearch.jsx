import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AutocompleteSearch = ({ onPlaceChanged }) => {
  const inputRef = useRef(null); // Reference to the input element
  const autocompleteRef = useRef(null); // Reference to the Autocomplete instance
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Ensure you're using the correct API key

  const fetchSuggestions = async (searchText) => {
    try {
      setLoading(true);
      const response = await axios.post(
        'https://places.googleapis.com/v1/places:autocomplete',
        {
          input: searchText,
          languageCode: "en",
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': API_KEY,
          },
        }
      );

      if (response.data.suggestions && response.data.suggestions.length > 0) {
        setSuggestions(response.data.suggestions);
      } else {
        // Handle case when no suggestions are returned
        setSuggestions([]);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    // Check if input has at least 3 characters and contains a number (basic address check)
    const containsNumber = /\d/.test(value);

    if (value.length >= 3 && containsNumber) {
      fetchSuggestions(value); // Fetch suggestions if input has a number
    } else if (value.length >= 3) {
      // Optional: Show a message that an address with a number is required
      setSuggestions([]);
    } else {
      setSuggestions([]); // Clear suggestions if the input is too short
    }
  };

  const handleSelectPlace = async (suggestion) => {
    setInput(suggestion.placePrediction.text.text); // Set the selected place as the input
    setSuggestions([]); // Clear suggestions after selection

    try {
      // Get place details using the placeId
      const placeDetailsResponse = await axios.get(
        `https://places.googleapis.com/v1/places/${suggestion.placePrediction.placeId}`,
        {
          headers: {
            'X-Goog-Api-Key': API_KEY, // Use correct header format
          },
          params: {
            fields: "location", // Ensure only necessary data is requested
          },
        }
      );

      const place = placeDetailsResponse.data;

      // Extract latitude and longitude from place details
      if (place.location) {
        const coordinates = {
          lat: place.location.latitude,
          lng: place.location.longitude,
        };

        // Pass the coordinates to the parent component
        onPlaceChanged(coordinates);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  return (
    <div style={{ position: 'relative', width: '500px' }}>
      <input
        name='address'
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Type an Address"
        style={{ width: '100%', height: '40px', padding: '5px' }}
        autoComplete='off'
        aria-autocomplete="none"
      />

      {loading && <p>Loading...</p>}

      {/* Show a helpful message when no suggestions are found */}
      {suggestions.length === 0 && input.length > 2 && !/\d/.test(input) && (
        <p>Please provide a complete address with a house number.</p>
      )}

      {/* Display the suggestions below the input */}
      {suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '45px', // Adjust the position of the list below the input
            left: '0',
            width: '100%',
            background: 'white',
            border: '1px solid #ccc',
            maxHeight: '200px',
            overflowY: 'auto',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: 9999,
            margin: 0,
            padding: 0,
            listStyleType: 'none',
          }}
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.placePrediction.placeId}
              onClick={() => handleSelectPlace(suggestion)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                borderBottom: '1px solid #ddd',
              }}
            >
              {suggestion.placePrediction.structuredFormat.mainText.text}
              <p style={{ color: '#666', fontSize: '0.8em' }}>
                {suggestion.placePrediction.structuredFormat.secondaryText.text}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteSearch;