import { useState, useEffect } from 'react';
import './CropAnalysis.css';

const CropAnalysis = () => {
  const [inputs, setInputs] = useState({
    district: '', crop: '', farmSize: '', season: '', irrigation: 'Yes', previousCrop: ''
  });
  const [result, setResult] = useState(null);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableCrops, setAvailableCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/districts')
      .then(res => res.json())
      .then(data => {
        if (data.districts) setAvailableDistricts(data.districts.sort((a, b) => a.localeCompare(b)));
      })
      .catch(() => setAvailableDistricts([]));
  }, []);

  useEffect(() => {
    if (inputs.district) {
      fetch(`http://localhost:5000/crops?district=${encodeURIComponent(inputs.district)}`)
        .then(res => res.json())
        .then(data => {
          if (data.crops) {
            setAvailableCrops(data.crops);
            if (!data.crops.includes(inputs.crop)) setInputs(prev => ({ ...prev, crop: '' }));
            if (!data.crops.includes(inputs.previousCrop)) setInputs(prev => ({ ...prev, previousCrop: '' }));
          } else {
            setAvailableCrops([]);
          }
        })
        .catch(() => setAvailableCrops([]));
    } else {
      setAvailableCrops([]);
    }
  }, [inputs.district]);

  const handleChange = (e) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsStale(false);
    const payload = {
      district: inputs.district, crop: inputs.crop,
      farm_size_ha: parseFloat(inputs.farmSize), season: inputs.season,
      irrigation: inputs.irrigation, previous_crop: inputs.previousCrop
    };
    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setResult(data);
      // Cache result
      localStorage.setItem('crop_analysis_cache', JSON.stringify({
        result: data, inputs: payload, timestamp: new Date().toISOString()
      }));
    } catch (error) {
      // Try cached
      try {
        const cached = JSON.parse(localStorage.getItem('crop_analysis_cache'));
        if (cached) {
          setResult(cached.result);
          setIsStale(true);
        } else {
          setResult({ error: `Server unreachable. Please try again later.` });
        }
      } catch {
        setResult({ error: `Failed to fetch analysis: ${error.message}` });
      }
    }
    setLoading(false);
  };

  const resultItems = result && !result.error ? [
    { emoji: '📅', label: 'Best Planting Time', value: result['Optimal Planting Time'] },
    { emoji: '🧪', label: 'Fertilizer Advice', value: result['Fertilizer Recommendation'] },
    { emoji: '💧', label: 'Water Needed', value: result['Water Requirement'] },
    { emoji: '🐛', label: 'Pest & Disease Risk', value: result['Pest & Disease Risk'] },
  ] : [];

  return (
    <div className="crop-page">
      <header className="crop-header">
        <div className="container">
          <h1 className="crop-page-title">🌱 Crop Analysis</h1>
          <p className="crop-page-subtitle">Get expert advice on growing your crop</p>
        </div>
      </header>

      <div className="container crop-body">
        <form onSubmit={handleSubmit} className="crop-form farmer-card">
          <div className="form-group">
            <label className="form-label">📍 District</label>
            <select name="district" value={inputs.district} onChange={handleChange} className="form-control" required>
              <option value="">Select your district</option>
              {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">🌾 Crop</label>
              <select name="crop" value={inputs.crop} onChange={handleChange} className="form-control" required disabled={!inputs.district}>
                <option value="">Select crop</option>
                {availableCrops.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {!inputs.district && <span className="form-hint">Select district first</span>}
            </div>
            <div className="form-group">
              <label className="form-label">📏 Farm Size (hectares)</label>
              <input type="number" name="farmSize" value={inputs.farmSize} onChange={handleChange} className="form-control" placeholder="e.g. 2" step="0.1" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">🗓️ Season</label>
              <select name="season" value={inputs.season} onChange={handleChange} className="form-control" required>
                <option value="">Select season</option>
                <option value="Kharif">Kharif (Monsoon)</option>
                <option value="Rabi">Rabi (Winter)</option>
                <option value="Whole Year">Whole Year</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">💧 Irrigation Available?</label>
              <select name="irrigation" value={inputs.irrigation} onChange={handleChange} className="form-control">
                <option value="Yes">Yes ✅</option>
                <option value="No">No ❌</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">🔄 Previous Crop</label>
            <select name="previousCrop" value={inputs.previousCrop} onChange={handleChange} className="form-control" required disabled={!inputs.district}>
              <option value="">What did you grow last?</option>
              {availableCrops.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{width: '100%'}} disabled={loading}>
            {loading ? '⏳ Analyzing...' : '🔍 Analyze My Crop'}
          </button>
        </form>

        {isStale && (
          <div className="stale-banner mt-3">
            <span className="stale-icon">📅</span>
            <span>Showing last saved results – server may be offline</span>
          </div>
        )}

        {result && !result.error && (
          <div className="crop-results mt-3">
            <h2 className="results-title">📋 Your Crop Report</h2>
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

        {result?.error && (
          <div className="weather-error mt-3">⚠️ {result.error}</div>
        )}
      </div>
    </div>
  );
};

export default CropAnalysis;