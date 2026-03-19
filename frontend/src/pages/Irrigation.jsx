import { useState } from 'react';
import axios from 'axios';
import './Irrigation.css';

const Irrigation = () => {
  const [formData, setFormData] = useState({
    Crop_Type: '', Farm_Area: '', Irrigation_Type: '', Season: '', Motor_Capacity: '',
  });
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isStale, setIsStale] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsStale(false);
    setError(null);

    if (!formData.Crop_Type || !formData.Farm_Area || !formData.Irrigation_Type || !formData.Season || !formData.Motor_Capacity) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const data = {
      'Crop_Type': formData.Crop_Type,
      'Farm_Area(acres)': parseFloat(formData.Farm_Area),
      'Irrigation_Type': formData.Irrigation_Type,
      'Season': formData.Season,
      'Motor_Capacity(HP)': parseFloat(formData.Motor_Capacity),
    };

    try {
      const response = await axios.post('http://localhost:5000/irrigation-prediction', data);
      setPredictions(response.data);
      localStorage.setItem('irrigation_cache', JSON.stringify({
        result: response.data, timestamp: new Date().toISOString()
      }));
    } catch (err) {
      const cached = JSON.parse(localStorage.getItem('irrigation_cache') || 'null');
      if (cached) {
        setPredictions(cached.result);
        setIsStale(true);
      } else {
        setError('Server unreachable. Please try again later.');
      }
    }
    setLoading(false);
  };

  const resultItems = predictions ? [
    { emoji: '⏱️', label: 'Irrigation Time', value: `${(predictions['Irrigation_Time(hours)'] || 0).toFixed(2)} hours` },
    { emoji: '🚿', label: 'Total Water Needed', value: `${(predictions['Total_Water_Needed(cubic meters)'] || 0).toFixed(2)} cubic meters` },
    { emoji: '⚡', label: 'Energy Consumption', value: `${(predictions['Energy_Consumption(kWh)'] || 0).toFixed(2)} kWh` },
    { emoji: '📊', label: 'System Efficiency', value: `${(predictions['Irrigation_System_Efficiency(%)'] || 0).toFixed(2)}%` },
  ] : [];

  return (
    <div className="irrigation-page">
      <header className="irrigation-header">
        <div className="container">
          <h1 className="irrigation-page-title">💧 Irrigation Planner</h1>
          <p className="irrigation-page-subtitle">Save water & electricity – know exactly what your farm needs</p>
        </div>
      </header>

      <div className="container irrigation-body">
        <form onSubmit={handleSubmit} className="irrigation-form farmer-card">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">🌾 Crop Type</label>
              <select name="Crop_Type" value={formData.Crop_Type} onChange={handleChange} className="form-control" required>
                <option value="">Select crop</option>
                <optgroup label="🌾 Cereals (अनाज)">
                  <option value="Wheat">Wheat (गेहूं)</option>
                  <option value="Rice">Rice (चावल)</option>
                  <option value="Maize">Maize (मक्का)</option>
                  <option value="Bajra">Bajra (बाजरा)</option>
                  <option value="Jowar">Jowar (ज्वार)</option>
                  <option value="Ragi">Ragi (रागी)</option>
                  <option value="Barley">Barley (जौ)</option>
                </optgroup>
                <optgroup label="🫘 Pulses (दालें)">
                  <option value="Gram">Gram / Chana (चना)</option>
                  <option value="Lentil">Lentil / Masoor (मसूर)</option>
                  <option value="Peas">Peas / Matar (मटर)</option>
                  <option value="Chickpea">Chickpea (काबुली चना)</option>
                </optgroup>
                <optgroup label="🌻 Oilseeds (तिलहन)">
                  <option value="Mustard">Mustard (सरसों)</option>
                  <option value="Groundnut">Groundnut (मूंगफली)</option>
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Sunflower">Sunflower (सूरजमुखी)</option>
                  <option value="Sesame">Sesame / Til (तिल)</option>
                  <option value="Linseed">Linseed / Alsi (अलसी)</option>
                </optgroup>
                <optgroup label="🥬 Vegetables (सब्ज़ियां)">
                  <option value="Potato">Potato (आलू)</option>
                  <option value="Onion">Onion (प्याज)</option>
                  <option value="Tomato">Tomato (टमाटर)</option>
                  <option value="Brinjal">Brinjal (बैंगन)</option>
                  <option value="Chilli">Chilli (मिर्च)</option>
                </optgroup>
                <optgroup label="🏭 Cash Crops (नकदी फसलें)">
                  <option value="Sugarcane">Sugarcane (गन्ना)</option>
                  <option value="Cotton">Cotton (कपास)</option>
                  <option value="Jute">Jute (पटसन)</option>
                  <option value="Tobacco">Tobacco (तम्बाकू)</option>
                  <option value="Turmeric">Turmeric (हल्दी)</option>
                  <option value="Banana">Banana (केला)</option>
                </optgroup>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">📏 Farm Area (acres)</label>
              <input type="number" name="Farm_Area" value={formData.Farm_Area} onChange={handleChange} className="form-control" step="0.1" min="0" placeholder="e.g. 2" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">🌊 Irrigation Method</label>
              <select name="Irrigation_Type" value={formData.Irrigation_Type} onChange={handleChange} className="form-control" required>
                <option value="">Select method</option>
                <option value="Drip">Drip (टपक सिंचाई)</option>
                <option value="Flood">Flood (बाढ़ सिंचाई)</option>
                <option value="Sprinkler">Sprinkler (फव्वारा)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">🗓️ Season</label>
              <select name="Season" value={formData.Season} onChange={handleChange} className="form-control" required>
                <option value="">Select season</option>
                <option value="Kharif">Kharif (खरीफ)</option>
                <option value="Rabi">Rabi (रबी)</option>
                <option value="Summer">Summer (गर्मी)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">⚙️ Motor Capacity (HP)</label>
            <input type="number" name="Motor_Capacity" value={formData.Motor_Capacity} onChange={handleChange} className="form-control" step="0.1" min="0" placeholder="e.g. 5" required />
            <span className="form-hint">How powerful is your motor pump?</span>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{width: '100%'}} disabled={loading}>
            {loading ? '⏳ Calculating...' : '💧 Calculate Irrigation'}
          </button>
        </form>

        {error && <div className="weather-error mt-3">⚠️ {error}</div>}

        {isStale && (
          <div className="stale-banner mt-3">
            <span className="stale-icon">📅</span>
            <span>Showing last saved results – server may be offline</span>
          </div>
        )}

        {predictions && (
          <div className="irrigation-results mt-3">
            <h2 className="results-title">💧 Irrigation Report</h2>
            <div className="results-grid">
              {resultItems.map((item, idx) => (
                <div key={idx} className="result-card">
                  <span className="result-emoji">{item.emoji}</span>
                  <h4>{item.label}</h4>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Irrigation;