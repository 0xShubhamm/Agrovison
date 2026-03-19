import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './History.css';

const History = () => {
  const [weatherCache, setWeatherCache] = useState(null);
  const [dashboardCache, setDashboardCache] = useState(null);
  const [cropAnalysisCache, setCropAnalysisCache] = useState(null);
  const [priceCache, setPriceCache] = useState(null);
  const [irrigationCache, setIrrigationCache] = useState(null);

  useEffect(() => {
    // Load all caches
    try {
      const lastCity = localStorage.getItem('weather_last_city');
      if (lastCity) {
        const w = JSON.parse(localStorage.getItem(`weather_${lastCity.toLowerCase()}`));
        if (w) setWeatherCache({ ...w, city: lastCity });
      }
    } catch {}

    try {
      const d = JSON.parse(localStorage.getItem('dashboard_cache'));
      if (d) setDashboardCache(d);
    } catch {}

    try {
      const c = JSON.parse(localStorage.getItem('crop_analysis_cache'));
      if (c) setCropAnalysisCache(c);
    } catch {}

    try {
      const p = JSON.parse(localStorage.getItem('price_prediction_cache'));
      if (p) setPriceCache(p);
    } catch {}

    try {
      const i = JSON.parse(localStorage.getItem('irrigation_cache'));
      if (i) setIrrigationCache(i);
    } catch {}
  }, []);

  const formatTime = (ts) => {
    try { return new Date(ts).toLocaleString(); } catch { return 'Unknown'; }
  };

  const hasAnyData = weatherCache || dashboardCache || cropAnalysisCache || priceCache || irrigationCache;

  return (
    <div className="history-page">
      <header className="history-header">
        <div className="container">
          <h1 className="history-page-title">📅 Past Data & History</h1>
          <p className="history-page-subtitle">
            Previously fetched data saved on your device – available even without internet
          </p>
        </div>
      </header>

      <div className="container history-body">
        {!hasAnyData && (
          <div className="no-history-card">
            <span className="no-history-emoji">📭</span>
            <h3>No Saved Data Yet</h3>
            <p>Once you use any service (weather, prices, crop analysis, etc.), the data will be saved here automatically.</p>
            <Link to="/services" className="btn btn-primary">🌾 Explore Services</Link>
          </div>
        )}

        {/* Weather */}
        {weatherCache && (
          <div className="history-card">
            <div className="history-card-header">
              <span className="hc-emoji">🌤️</span>
              <div>
                <h3>Weather – {weatherCache.city}</h3>
                <span className="hc-time">Saved: {formatTime(weatherCache.timestamp)}</span>
              </div>
              <Link to="/services/weather" className="btn btn-secondary">View Live →</Link>
            </div>
            <div className="history-card-body">
              <div className="history-stats">
                <div className="history-stat">
                  <span className="hs-label">🌡️ Temperature</span>
                  <span className="hs-value">{Math.round(weatherCache.weather.main.temp)}°C</span>
                </div>
                <div className="history-stat">
                  <span className="hs-label">💧 Humidity</span>
                  <span className="hs-value">{weatherCache.weather.main.humidity}%</span>
                </div>
                <div className="history-stat">
                  <span className="hs-label">💨 Wind</span>
                  <span className="hs-value">{Math.round(weatherCache.weather.wind.speed * 3.6)} km/h</span>
                </div>
                <div className="history-stat">
                  <span className="hs-label">☁️ Clouds</span>
                  <span className="hs-value">{weatherCache.weather.clouds.all}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mandi Prices */}
        {dashboardCache && (
          <div className="history-card">
            <div className="history-card-header">
              <span className="hc-emoji">📊</span>
              <div>
                <h3>Market Prices</h3>
                <span className="hc-time">Saved: {formatTime(dashboardCache.timestamp)}</span>
              </div>
              <Link to="/services/dashboard" className="btn btn-secondary">View Live →</Link>
            </div>
            <div className="history-card-body">
              <p className="history-summary">{dashboardCache.data.length} price records from {[...new Set(dashboardCache.data.map(d => d.market))].length} markets</p>
              <div className="history-mini-table">
                {dashboardCache.data.slice(0, 5).map((item, i) => (
                  <div key={i} className="mini-row">
                    <span className="mini-crop">{item.commodity}</span>
                    <span className="mini-market">{item.market}</span>
                    <span className="mini-price">₹{item.modal_price?.toLocaleString()}</span>
                  </div>
                ))}
                {dashboardCache.data.length > 5 && <p className="text-muted text-center mt-2">...and {dashboardCache.data.length - 5} more</p>}
              </div>
            </div>
          </div>
        )}

        {/* Crop Analysis */}
        {cropAnalysisCache && (
          <div className="history-card">
            <div className="history-card-header">
              <span className="hc-emoji">🌱</span>
              <div>
                <h3>Crop Analysis – {cropAnalysisCache.inputs?.crop || 'Unknown'}</h3>
                <span className="hc-time">Saved: {formatTime(cropAnalysisCache.timestamp)}</span>
              </div>
              <Link to="/services/crop-analysis" className="btn btn-secondary">New Analysis →</Link>
            </div>
            <div className="history-card-body">
              <div className="history-stats">
                {Object.entries(cropAnalysisCache.result).map(([key, val]) => (
                  <div key={key} className="history-stat wide">
                    <span className="hs-label">{key}</span>
                    <span className="hs-value-sm">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Price Prediction */}
        {priceCache && (
          <div className="history-card">
            <div className="history-card-header">
              <span className="hc-emoji">💰</span>
              <div>
                <h3>Price Prediction</h3>
                <span className="hc-time">Saved: {formatTime(priceCache.timestamp)}</span>
              </div>
              <Link to="/services/crop-price-prediction" className="btn btn-secondary">New Prediction →</Link>
            </div>
            <div className="history-card-body">
              <div className="history-stats">
                {Object.entries(priceCache.result).map(([key, val]) => (
                  <div key={key} className="history-stat wide">
                    <span className="hs-label">{key.replace(/_/g, ' ')}</span>
                    <span className="hs-value-sm">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Irrigation */}
        {irrigationCache && (
          <div className="history-card">
            <div className="history-card-header">
              <span className="hc-emoji">💧</span>
              <div>
                <h3>Irrigation Prediction</h3>
                <span className="hc-time">Saved: {formatTime(irrigationCache.timestamp)}</span>
              </div>
              <Link to="/services/irrigation" className="btn btn-secondary">New Prediction →</Link>
            </div>
            <div className="history-card-body">
              <div className="history-stats">
                {Object.entries(irrigationCache.result).map(([key, val]) => (
                  <div key={key} className="history-stat">
                    <span className="hs-label">{key.replace(/[()]/g, '').replace(/_/g, ' ')}</span>
                    <span className="hs-value">{typeof val === 'number' ? val.toFixed(2) : val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {hasAnyData && (
          <p className="history-note">
            💡 This data is saved on your phone/computer. You can see it even when the internet is slow or not working.
          </p>
        )}
      </div>
    </div>
  );
};

export default History;
