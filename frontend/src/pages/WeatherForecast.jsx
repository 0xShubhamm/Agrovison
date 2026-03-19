import { useState } from 'react';
import "./WeatherForecast.css";
import SearchBar from '../components/weather/SearchBar';
import WeatherCurrent from '../components/weather/WeatherCurrent';
import HourlyForecast from '../components/weather/HourlyForecast';
import WeeklyForecast from '../components/weather/WeeklyForecast';
import axios from 'axios';

function WeatherForecast() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [staleTime, setStaleTime] = useState(null);

  const API_KEY = '4430343dc8149c573dd0523e962d7d7b';

  const getCachedWeather = (city) => {
    try {
      const cached = localStorage.getItem(`weather_${city.toLowerCase()}`);
      if (cached) return JSON.parse(cached);
    } catch (e) { /* ignore */ }
    return null;
  };

  const cacheWeather = (city, weather, forecast) => {
    try {
      localStorage.setItem(`weather_${city.toLowerCase()}`, JSON.stringify({
        weather, forecast, timestamp: new Date().toISOString()
      }));
      localStorage.setItem('weather_last_city', city);
    } catch (e) { /* ignore */ }
  };

  const fetchWeather = async (city) => {
    if (!city) return;
    setLoading(true);
    setError(null);
    setIsStale(false);
    setStaleTime(null);

    try {
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
      ]);
      setWeatherData(currentRes.data);
      setForecastData(forecastRes.data);
      cacheWeather(city, currentRes.data, forecastRes.data);
    } catch (err) {
      // Try cached data
      const cached = getCachedWeather(city);
      if (cached) {
        setWeatherData(cached.weather);
        setForecastData(cached.forecast);
        setIsStale(true);
        setStaleTime(new Date(cached.timestamp).toLocaleString());
        setError(null);
      } else {
        setError('City not found. Please check the name and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getFarmingAdvice = () => {
    if (!weatherData) return null;
    const wind = weatherData.wind.speed * 3.6;
    const rainChance = weatherData.clouds.all;
    const temp = weatherData.main.temp;
    const advice = [];

    if (wind < 15 && rainChance < 30) advice.push('✅ Good day for spraying pesticides');
    if (rainChance > 60) advice.push('🌧️ Rain expected – avoid watering fields');
    if (temp > 40) advice.push('🔥 Very hot – irrigate early morning or evening');
    if (temp < 5) advice.push('❄️ Frost risk – protect sensitive crops');
    if (wind > 30) advice.push('💨 Strong winds – secure loose structures');
    if (rainChance < 20 && temp >= 20 && temp <= 35) advice.push('🌾 Great conditions for harvesting');
    if (advice.length === 0) advice.push('☀️ Normal conditions – carry on with regular farm work');

    return advice;
  };

  return (
    <div className="weather-page">
      <header className="weather-header">
        <div className="container">
          <h1 className="weather-page-title">🌤️ Weather Forecast</h1>
          <p className="weather-page-subtitle">Check the weather before going to the field</p>
          <SearchBar onSearch={fetchWeather} />
        </div>
      </header>

      <div className="container weather-body">
        {loading && <div className="weather-loading">⏳ Loading weather data...</div>}
        {error && <div className="weather-error">⚠️ {error}</div>}

        {isStale && staleTime && (
          <div className="stale-banner">
            <span className="stale-icon">📅</span>
            <span>Showing saved data from <strong>{staleTime}</strong> – internet may be slow</span>
          </div>
        )}

        {weatherData && forecastData && (
          <div className="weather-results">
            {/* Farming Advice */}
            <div className="farming-advice-card">
              <h3>🧑‍🌾 Farming Advice for Today</h3>
              <ul>
                {getFarmingAdvice()?.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>

            {/* Current Weather */}
            <div className="weather-current-card">
              <WeatherCurrent weather={weatherData} />
            </div>

            {/* Weekly Forecast */}
            <div className="weekly-section">
              <WeeklyForecast forecast={forecastData.list} />
            </div>

            {/* Hourly Forecast */}
            <div className="hourly-section">
              <HourlyForecast forecast={forecastData.list} />
            </div>

            {/* Air Conditions */}
            <div className="air-conditions-card">
              <h3>🌬️ Air Conditions</h3>
              <div className="conditions-grid">
                <div className="condition-item">
                  <span className="condition-label">🌡️ Feels Like</span>
                  <span className="condition-value">{Math.round(weatherData.main.feels_like)}°C</span>
                </div>
                <div className="condition-item">
                  <span className="condition-label">💨 Wind Speed</span>
                  <span className="condition-value">{Math.round(weatherData.wind.speed * 3.6)} km/h</span>
                </div>
                <div className="condition-item">
                  <span className="condition-label">🌧️ Rain Chance</span>
                  <span className="condition-value">{weatherData.clouds.all}%</span>
                </div>
                <div className="condition-item">
                  <span className="condition-label">💧 Humidity</span>
                  <span className="condition-value">{weatherData.main.humidity}%</span>
                </div>
                {isExpanded && (
                  <>
                    <div className="condition-item">
                      <span className="condition-label">📊 Pressure</span>
                      <span className="condition-value">{weatherData.main.pressure} hPa</span>
                    </div>
                    <div className="condition-item">
                      <span className="condition-label">👁️ Visibility</span>
                      <span className="condition-value">{weatherData.visibility / 1000} km</span>
                    </div>
                  </>
                )}
              </div>
              <button className="see-more-btn" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? 'Show Less' : 'See More Details'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherForecast;
