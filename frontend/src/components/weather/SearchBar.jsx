import { useState } from 'react';
import { FiSearch, FiMapPin } from 'react-icons/fi';

function SearchBar({ onSearch }) {
  const [city, setCity] = useState('');
  const [locating, setLocating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setCity('');
    }
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      alert('Location is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=4430343dc8149c573dd0523e962d7d7b&units=metric`
          );
          const data = await res.json();
          if (data.name) {
            onSearch(data.name);
          }
        } catch {
          alert('Could not get weather for your location.');
        }
        setLocating(false);
      },
      () => {
        alert('Please allow location access to use this feature.');
        setLocating(false);
      }
    );
  };

  return (
    <div className="search-wrapper">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <FiSearch className="search-icon" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter your city or village name..."
            className="search-input"
            id="weather-search-input"
          />
          <button type="submit" className="search-submit-btn" disabled={!city.trim()}>
            Search
          </button>
        </div>
      </form>
      <button
        type="button"
        className="location-btn"
        onClick={handleLocation}
        disabled={locating}
      >
        <FiMapPin /> {locating ? 'Finding...' : '📍 Use My Location'}
      </button>
    </div>
  );
}

export default SearchBar;