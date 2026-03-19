import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './PricePrediction.css';

const PricePrediction = () => {
  const [options, setOptions] = useState({ states: [], crops: [], stateDistricts: {} });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [form, setForm] = useState({ date: null, crop: '', state: '', district: '', fieldSize: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/options')
      .then(res => setOptions(res.data))
      .catch(err => console.error('Failed to fetch options:', err));
  }, []);

  useEffect(() => {
    setForm(prev => ({ ...prev, district: '' }));
  }, [form.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsStale(false);
    try {
      const formattedDate = form.date
        ? `${form.date.getDate().toString().padStart(2, '0')}-${(form.date.getMonth() + 1).toString().padStart(2, '0')}-${form.date.getFullYear()}`
        : '';
      const res = await axios.post('http://localhost:5000/crop-price-prediction', {
        date_str: formattedDate, crop: form.crop, state: form.state,
        district: form.district, field_size: parseFloat(form.fieldSize),
      });
      setResult(res.data);
      localStorage.setItem('price_prediction_cache', JSON.stringify({
        result: res.data, timestamp: new Date().toISOString()
      }));
    } catch (err) {
      const cached = JSON.parse(localStorage.getItem('price_prediction_cache') || 'null');
      if (cached) {
        setResult(cached.result);
        setIsStale(true);
      } else {
        alert(err.response?.data?.error || 'Prediction failed. Please try again.');
      }
    }
    setLoading(false);
  };

  const availableDistricts = form.state ? options.stateDistricts[form.state] || [] : [];

  const resultItems = result ? [
    { emoji: '📊', label: 'Price Range (Min-Max)', value: result.price_range },
    { emoji: '💰', label: 'Predicted Price', value: result.predicted_price },
    { emoji: '📍', label: 'Best Place to Sell', value: result.best_district },
    { emoji: '🏪', label: 'Storage Advice', value: result.storage_advice },
    { emoji: '📈', label: 'Market Trend', value: result.market_trend },
    { emoji: '💵', label: 'Expected Revenue', value: result.expected_revenue },
  ] : [];

  return (
    <div className="price-page">
      <header className="price-header">
        <div className="container">
          <h1 className="price-page-title">💰 Crop Price Prediction</h1>
          <p className="price-page-subtitle">Know your crop's price before you sell</p>
        </div>
      </header>

      <div className="container price-body">
        <form onSubmit={handleSubmit} className="price-form farmer-card">
          <div className="form-group">
            <label className="form-label">📅 Date</label>
            <DatePicker
              selected={form.date}
              onChange={(date) => setForm({ ...form, date })}
              dateFormat="dd-MM-yyyy"
              placeholderText="Select date"
              className="form-control"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">🌾 Crop</label>
              <select value={form.crop} onChange={e => setForm({ ...form, crop: e.target.value })} className="form-control" required>
                <option value="">Select crop</option>
                {options.crops.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">🏛️ State</label>
              <select value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="form-control" required>
                <option value="">Select state</option>
                {options.states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">📍 District</label>
              <select value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} className="form-control" required disabled={!form.state}>
                <option value="">Select district</option>
                {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {!form.state && <span className="form-hint">Select state first</span>}
            </div>
            <div className="form-group">
              <label className="form-label">📏 Field Size (acres)</label>
              <input type="number" value={form.fieldSize} onChange={e => setForm({ ...form, fieldSize: e.target.value })} min="0.1" step="0.1" className="form-control" required placeholder="e.g. 5" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{width: '100%'}} disabled={loading}>
            {loading ? '⏳ Predicting...' : '🔮 Predict Price'}
          </button>
        </form>

        {isStale && (
          <div className="stale-banner mt-3">
            <span className="stale-icon">📅</span>
            <span>Showing last saved prediction – server may be offline</span>
          </div>
        )}

        {result && (
          <div className="price-results mt-3">
            <h2 className="results-title">📋 Price Report</h2>
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

export default PricePrediction;