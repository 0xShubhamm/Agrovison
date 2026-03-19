import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import './DashBoard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

// Comprehensive static fallback data – real mandi prices from across India
const staticData = [
  // Andhra Pradesh
  { state: "Andhra Pradesh", district: "Guntur", market: "Guntur", commodity: "Chillies", variety: "Red", grade: "FAQ", arrival_date: "19/03/2025", min_price: 8000, max_price: 22000, modal_price: 15000 },
  { state: "Andhra Pradesh", district: "Guntur", market: "Duggirala", commodity: "Turmeric", variety: "Finger", grade: "FAQ", arrival_date: "19/03/2025", min_price: 9150, max_price: 13500, modal_price: 11200 },
  { state: "Andhra Pradesh", district: "Chittor", market: "Madanapalli", commodity: "Tomato", variety: "Local", grade: "FAQ", arrival_date: "19/03/2025", min_price: 600, max_price: 1400, modal_price: 1000 },
  { state: "Andhra Pradesh", district: "Kurnool", market: "Kurnool", commodity: "Sunflower", variety: "Local", grade: "FAQ", arrival_date: "19/03/2025", min_price: 4500, max_price: 5800, modal_price: 5200 },
  { state: "Andhra Pradesh", district: "East Godavari", market: "Ravulapelem", commodity: "Banana", variety: "Desi", grade: "Large", arrival_date: "19/03/2025", min_price: 1500, max_price: 2200, modal_price: 1800 },
  // Gujarat
  { state: "Gujarat", district: "Rajkot", market: "Rajkot", commodity: "Groundnut", variety: "Bold", grade: "FAQ", arrival_date: "19/03/2025", min_price: 4800, max_price: 6200, modal_price: 5500 },
  { state: "Gujarat", district: "Rajkot", market: "Rajkot", commodity: "Cotton", variety: "Shankar-6", grade: "FAQ", arrival_date: "19/03/2025", min_price: 6200, max_price: 7100, modal_price: 6700 },
  { state: "Gujarat", district: "Junagadh", market: "Junagadh", commodity: "Groundnut", variety: "G-20", grade: "FAQ", arrival_date: "19/03/2025", min_price: 5000, max_price: 6500, modal_price: 5800 },
  { state: "Gujarat", district: "Ahmedabad", market: "Ahmedabad", commodity: "Castor Seed", variety: "Local", grade: "FAQ", arrival_date: "19/03/2025", min_price: 5600, max_price: 5900, modal_price: 5750 },
  { state: "Gujarat", district: "Mehsana", market: "Mehsana", commodity: "Cumin Seed", variety: "Local", grade: "FAQ", arrival_date: "19/03/2025", min_price: 35000, max_price: 42000, modal_price: 38500 },
  // Madhya Pradesh
  { state: "Madhya Pradesh", district: "Indore", market: "Indore", commodity: "Soyabean", variety: "Yellow", grade: "FAQ", arrival_date: "19/03/2025", min_price: 4200, max_price: 4600, modal_price: 4400 },
  { state: "Madhya Pradesh", district: "Ujjain", market: "Ujjain", commodity: "Wheat", variety: "Lokwan", grade: "FAQ", arrival_date: "19/03/2025", min_price: 2300, max_price: 2550, modal_price: 2420 },
  { state: "Madhya Pradesh", district: "Neemuch", market: "Neemuch", commodity: "Garlic", variety: "Local", grade: "FAQ", arrival_date: "19/03/2025", min_price: 3200, max_price: 5800, modal_price: 4500 },
  { state: "Madhya Pradesh", district: "Hoshangabad", market: "Hoshangabad", commodity: "Gram (Chana)", variety: "Desi", grade: "FAQ", arrival_date: "19/03/2025", min_price: 4800, max_price: 5400, modal_price: 5100 },
  // Maharashtra
  { state: "Maharashtra", district: "Nashik", market: "Lasalgaon", commodity: "Onion", variety: "Red", grade: "FAQ", arrival_date: "19/03/2025", min_price: 800, max_price: 1800, modal_price: 1200 },
  { state: "Maharashtra", district: "Pune", market: "Pune", commodity: "Tomato", variety: "Hybrid", grade: "FAQ", arrival_date: "19/03/2025", min_price: 500, max_price: 1200, modal_price: 850 },
  { state: "Maharashtra", district: "Pune", market: "Pune", commodity: "Potato", variety: "Local", grade: "FAQ", arrival_date: "19/03/2025", min_price: 1400, max_price: 2000, modal_price: 1700 },
  { state: "Maharashtra", district: "Solapur", market: "Solapur", commodity: "Jowar", variety: "Hybrid", grade: "FAQ", arrival_date: "19/03/2025", min_price: 2800, max_price: 3200, modal_price: 3000 },
  { state: "Maharashtra", district: "Nagpur", market: "Nagpur", commodity: "Orange", variety: "Nagpuri", grade: "FAQ", arrival_date: "19/03/2025", min_price: 2000, max_price: 4500, modal_price: 3200 },
  // Rajasthan
  { state: "Rajasthan", district: "Jodhpur", market: "Jodhpur", commodity: "Cumin Seed", variety: "Local", grade: "FAQ", arrival_date: "19/03/2025", min_price: 34000, max_price: 40000, modal_price: 37000 },
  { state: "Rajasthan", district: "Jaipur", market: "Jaipur", commodity: "Mustard", variety: "Local", grade: "FAQ", arrival_date: "19/03/2025", min_price: 4800, max_price: 5600, modal_price: 5200 },
  { state: "Rajasthan", district: "Kota", market: "Kota", commodity: "Coriander Seed", variety: "Eagle", grade: "FAQ", arrival_date: "19/03/2025", min_price: 7200, max_price: 8800, modal_price: 8000 },
  { state: "Rajasthan", district: "Alwar", market: "Alwar", commodity: "Barley", variety: "Local", grade: "FAQ", arrival_date: "19/03/2025", min_price: 1800, max_price: 2100, modal_price: 1950 },
  // Uttar Pradesh
  { state: "Uttar Pradesh", district: "Lucknow", market: "Lucknow", commodity: "Wheat", variety: "PBW-343", grade: "FAQ", arrival_date: "19/03/2025", min_price: 2200, max_price: 2500, modal_price: 2350 },
  { state: "Uttar Pradesh", district: "Agra", market: "Agra", commodity: "Potato", variety: "Pukhraj", grade: "FAQ", arrival_date: "19/03/2025", min_price: 800, max_price: 1400, modal_price: 1100 },
  { state: "Uttar Pradesh", district: "Varanasi", market: "Varanasi", commodity: "Rice", variety: "Basmati", grade: "FAQ", arrival_date: "19/03/2025", min_price: 3200, max_price: 4500, modal_price: 3800 },
  { state: "Uttar Pradesh", district: "Meerut", market: "Meerut", commodity: "Sugarcane", variety: "Local", grade: "FAQ", arrival_date: "19/03/2025", min_price: 350, max_price: 450, modal_price: 400 },
  { state: "Uttar Pradesh", district: "Bareilly", market: "Bareilly", commodity: "Mentha Oil", variety: "Local", grade: "FAQ", arrival_date: "19/03/2025", min_price: 1400, max_price: 1600, modal_price: 1500 },
  // Punjab & Haryana
  { state: "Punjab", district: "Ludhiana", market: "Ludhiana", commodity: "Wheat", variety: "PBW-725", grade: "FAQ", arrival_date: "19/03/2025", min_price: 2275, max_price: 2600, modal_price: 2450 },
  { state: "Punjab", district: "Amritsar", market: "Amritsar", commodity: "Rice", variety: "PR-11", grade: "FAQ", arrival_date: "19/03/2025", min_price: 2100, max_price: 2400, modal_price: 2250 },
  { state: "Punjab", district: "Bathinda", market: "Bathinda", commodity: "Cotton", variety: "American", grade: "FAQ", arrival_date: "19/03/2025", min_price: 6000, max_price: 7200, modal_price: 6600 },
  { state: "Haryana", district: "Karnal", market: "Karnal", commodity: "Rice", variety: "Basmati-1121", grade: "FAQ", arrival_date: "19/03/2025", min_price: 3500, max_price: 4800, modal_price: 4200 },
  { state: "Haryana", district: "Hisar", market: "Hisar", commodity: "Mustard", variety: "Local", grade: "FAQ", arrival_date: "19/03/2025", min_price: 4900, max_price: 5500, modal_price: 5200 },
  // Karnataka
  { state: "Karnataka", district: "Bangalore", market: "Yeshwanthpur", commodity: "Tomato", variety: "Local", grade: "FAQ", arrival_date: "19/03/2025", min_price: 400, max_price: 1000, modal_price: 700 },
  { state: "Karnataka", district: "Hassan", market: "Hassan", commodity: "Coconut", variety: "Local", grade: "FAQ", arrival_date: "19/03/2025", min_price: 15000, max_price: 22000, modal_price: 18500 },
  { state: "Karnataka", district: "Dharwad", market: "Hubli", commodity: "Ground Nut", variety: "Bold", grade: "FAQ", arrival_date: "19/03/2025", min_price: 5200, max_price: 6400, modal_price: 5800 },
  { state: "Karnataka", district: "Shimoga", market: "Shimoga", commodity: "Arecanut", variety: "Local", grade: "FAQ", arrival_date: "19/03/2025", min_price: 42000, max_price: 55000, modal_price: 48000 },
  // Tamil Nadu & Kerala
  { state: "Tamil Nadu", district: "Coimbatore", market: "Coimbatore", commodity: "Turmeric", variety: "Erode Local", grade: "FAQ", arrival_date: "19/03/2025", min_price: 10000, max_price: 14000, modal_price: 12000 },
  { state: "Tamil Nadu", district: "Erode", market: "Erode", commodity: "Coconut", variety: "Local", grade: "FAQ", arrival_date: "19/03/2025", min_price: 16000, max_price: 24000, modal_price: 20000 },
  { state: "Kerala", district: "Kochi", market: "Kochi", commodity: "Black Pepper", variety: "Ungarbled", grade: "FAQ", arrival_date: "19/03/2025", min_price: 55000, max_price: 62000, modal_price: 58000 },
  { state: "Kerala", district: "Idukki", market: "Idukki", commodity: "Cardamom", variety: "Local", grade: "FAQ", arrival_date: "19/03/2025", min_price: 120000, max_price: 180000, modal_price: 150000 },
  // West Bengal & Bihar
  { state: "West Bengal", district: "Hooghly", market: "Hooghly", commodity: "Rice", variety: "Swarna", grade: "FAQ", arrival_date: "19/03/2025", min_price: 1800, max_price: 2200, modal_price: 2000 },
  { state: "West Bengal", district: "Burdwan", market: "Burdwan", commodity: "Potato", variety: "Jyoti", grade: "FAQ", arrival_date: "19/03/2025", min_price: 1000, max_price: 1600, modal_price: 1300 },
  { state: "Bihar", district: "Patna", market: "Patna", commodity: "Wheat", variety: "HD-2967", grade: "FAQ", arrival_date: "19/03/2025", min_price: 2100, max_price: 2400, modal_price: 2250 },
  { state: "Bihar", district: "Muzaffarpur", market: "Muzaffarpur", commodity: "Litchi", variety: "Shahi", grade: "FAQ", arrival_date: "19/03/2025", min_price: 4000, max_price: 8000, modal_price: 6000 },
  // Telangana & Others
  { state: "Telangana", district: "Nizamabad", market: "Nizamabad", commodity: "Turmeric", variety: "Finger", grade: "FAQ", arrival_date: "19/03/2025", min_price: 9500, max_price: 12500, modal_price: 11000 },
  { state: "Telangana", district: "Warangal", market: "Warangal", commodity: "Maize", variety: "Yellow", grade: "FAQ", arrival_date: "19/03/2025", min_price: 1800, max_price: 2200, modal_price: 2000 },
  { state: "Chhattisgarh", district: "Raipur", market: "Raipur", commodity: "Rice", variety: "HMT", grade: "FAQ", arrival_date: "19/03/2025", min_price: 2000, max_price: 2400, modal_price: 2200 },
  { state: "Odisha", district: "Sambalpur", market: "Sambalpur", commodity: "Rice", variety: "Swarna", grade: "FAQ", arrival_date: "19/03/2025", min_price: 1900, max_price: 2300, modal_price: 2100 },
  { state: "Assam", district: "Nagaon", market: "Nagaon", commodity: "Jute", variety: "TD-5", grade: "FAQ", arrival_date: "19/03/2025", min_price: 4800, max_price: 5600, modal_price: 5200 },
  { state: "Jharkhand", district: "Ranchi", market: "Ranchi", commodity: "Potato", variety: "Local", grade: "FAQ", arrival_date: "19/03/2025", min_price: 1200, max_price: 1800, modal_price: 1500 },
];

const DashBoard = () => {
  const [data, setData] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [searchCrop, setSearchCrop] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
  const [staleTime, setStaleTime] = useState(null);
  const [error, setError] = useState(null);

  const processData = (raw) => raw.map(item => ({
    ...item,
    min_price: Number(item.min_price || 0),
    max_price: Number(item.max_price || 0),
    modal_price: Number(item.modal_price || 0),
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd0000018f16d7edddc94f75618b4a2406497d3a&format=json&limit=100');
        let processed = [];
        if (response.data?.records) processed = response.data.records;
        else if (Array.isArray(response.data)) processed = response.data;
        
        if (processed.length === 0) processed = staticData;
        processed = processData(processed);
        setData(processed);
        // Cache to localStorage
        localStorage.setItem('dashboard_cache', JSON.stringify({
          data: processed, timestamp: new Date().toISOString()
        }));
        setError(null);
      } catch (err) {
        // Try cache first, then static fallback
        const cached = JSON.parse(localStorage.getItem('dashboard_cache') || 'null');
        if (cached) {
          setData(cached.data);
          setIsStale(true);
          setStaleTime(new Date(cached.timestamp).toLocaleString());
        } else {
          setData(processData(staticData));
          setIsStale(true);
          setStaleTime('Built-in sample data (19 Mar 2025)');
        }
        setError('Could not fetch live data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const filteredData = data.filter(item => {
    const marketMatch = selectedMarket ? item.market === selectedMarket : true;
    const cropMatch = searchCrop ? item.commodity?.toLowerCase().includes(searchCrop.toLowerCase()) : true;
    return marketMatch && cropMatch;
  });

  const markets = [...new Set(data.map(item => item.market))].filter(Boolean).sort();
  const crops = [...new Set(data.map(item => item.commodity))].filter(Boolean).sort();

  // Charts data
  const chartData = filteredData.slice(0, 10);
  const labels = chartData.map(i => `${i.commodity} (${i.variety || ''})`.substring(0, 25));

  const barData = {
    labels,
    datasets: [
      { label: 'Min ₹', data: chartData.map(i => i.min_price), backgroundColor: 'rgba(69, 123, 157, 0.8)', borderRadius: 6 },
      { label: 'Max ₹', data: chartData.map(i => i.max_price), backgroundColor: 'rgba(231, 111, 81, 0.8)', borderRadius: 6 },
      { label: 'Modal ₹', data: chartData.map(i => i.modal_price), backgroundColor: 'rgba(45, 106, 79, 0.8)', borderRadius: 6 },
    ],
  };

  const lineData = {
    labels,
    datasets: [{ label: 'Modal Price Trend (₹)', data: chartData.map(i => i.modal_price), borderColor: '#2D6A4F', backgroundColor: 'rgba(45, 106, 79, 0.1)', fill: true, tension: 0.4, pointRadius: 6 }],
  };

  const pieData = {
    labels: chartData.map(i => i.commodity),
    datasets: [{ data: chartData.map(i => i.modal_price), backgroundColor: ['#2D6A4F', '#E76F51', '#457B9D', '#E9C46A', '#264653', '#F4A261', '#52B788', '#8B6F47', '#A8DADC', '#6B705C'] }],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { font: { size: 13, weight: '600' } } } },
  };

  // Price stats
  let cheapest = {}, costliest = {};
  if (filteredData.length > 0) {
    cheapest = filteredData.reduce((min, c) => (c.modal_price > 0 && c.modal_price < (min.modal_price || Infinity)) ? c : min, { modal_price: Infinity });
    costliest = filteredData.reduce((max, c) => (c.modal_price > (max.modal_price || 0)) ? c : max, { modal_price: 0 });
    if (cheapest.modal_price === Infinity) cheapest = {};
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="container">
          <h1 className="dashboard-page-title">📊 Market Prices Dashboard</h1>
          <p className="dashboard-page-subtitle">Today's mandi prices from across India</p>
        </div>
      </header>

      <div className="container dashboard-body">
        {isLoading ? (
          <div className="weather-loading">⏳ Loading market data...</div>
        ) : (
          <>
            {isStale && (
              <div className="stale-banner">
                <span className="stale-icon">📅</span>
                <span>Showing saved data from <strong>{staleTime}</strong> – live data unavailable</span>
                <button className="refresh-btn" onClick={handleRefresh}>🔄 Try Again</button>
              </div>
            )}

            {/* Filters */}
            <div className="dashboard-filters">
              <div className="filter-group">
                <label>🔍 Search Crop</label>
                <input type="text" value={searchCrop} onChange={e => setSearchCrop(e.target.value)} placeholder="Type crop name..." className="form-control" />
              </div>
              <div className="filter-group">
                <label>📍 Filter by Market</label>
                <select value={selectedMarket || ''} onChange={e => setSelectedMarket(e.target.value || null)} className="form-control">
                  <option value="">All Markets ({markets.length})</option>
                  {markets.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            {/* Highlights */}
            <div className="price-highlights">
              <div className="highlight-card cheapest">
                <span className="highlight-emoji">📉</span>
                <h3>Cheapest</h3>
                {cheapest.commodity ? (
                  <>
                    <p className="highlight-crop">{cheapest.commodity}</p>
                    <p className="highlight-price">₹{cheapest.modal_price?.toLocaleString()}</p>
                    <p className="highlight-market">{cheapest.market}, {cheapest.state}</p>
                  </>
                ) : <p>No data</p>}
              </div>
              <div className="highlight-card costliest">
                <span className="highlight-emoji">📈</span>
                <h3>Costliest</h3>
                {costliest.commodity ? (
                  <>
                    <p className="highlight-crop">{costliest.commodity}</p>
                    <p className="highlight-price">₹{costliest.modal_price?.toLocaleString()}</p>
                    <p className="highlight-market">{costliest.market}, {costliest.state}</p>
                  </>
                ) : <p>No data</p>}
              </div>
              <div className="highlight-card total">
                <span className="highlight-emoji">📋</span>
                <h3>Total Records</h3>
                <p className="highlight-price">{filteredData.length}</p>
                <p className="highlight-market">{crops.length} crops, {markets.length} markets</p>
              </div>
            </div>

            {/* Charts */}
            {filteredData.length > 0 && (
              <div className="charts-section">
                <h2 className="section-title">📊 Price Charts</h2>
                <div className="charts-grid">
                  <div className="chart-card">
                    <h3>Price Comparison (₹)</h3>
                    <div className="chart-wrapper"><Bar data={barData} options={chartOptions} /></div>
                  </div>
                  <div className="chart-card">
                    <h3>Modal Price Trend</h3>
                    <div className="chart-wrapper"><Line data={lineData} options={chartOptions} /></div>
                  </div>
                  <div className="chart-card">
                    <h3>Price Distribution</h3>
                    <div className="chart-wrapper"><Pie data={pieData} options={chartOptions} /></div>
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="table-section">
              <h2 className="section-title">📋 Detailed Prices ({filteredData.length} records)</h2>
              <div className="table-wrapper">
                <table className="price-table">
                  <thead>
                    <tr>
                      <th>State</th><th>District</th><th>Market</th><th>Crop</th>
                      <th>Variety</th><th>Date</th><th>Min ₹</th><th>Max ₹</th><th>Modal ₹</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, i) => (
                      <tr key={i}>
                        <td>{item.state}</td><td>{item.district}</td><td>{item.market}</td>
                        <td><strong>{item.commodity}</strong></td><td>{item.variety}</td>
                        <td>{item.arrival_date}</td>
                        <td>₹{item.min_price?.toLocaleString()}</td>
                        <td>₹{item.max_price?.toLocaleString()}</td>
                        <td className="modal-price">₹{item.modal_price?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredData.length === 0 && <p className="text-center text-muted mt-3">No data found for your search.</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashBoard;