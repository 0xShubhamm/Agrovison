import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import './DashBoard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

// Static fallback data
const staticData = [
  { state: "Andhra Pradesh", district: "Anantapur", market: "Hindupur", commodity: "Tamarind Fruit", variety: "Non A/c Fine", grade: "FAQ", arrival_date: "20/03/2025", min_price: 8100, max_price: 33000, modal_price: 18000 },
  { state: "Andhra Pradesh", district: "Anantapur", market: "Hindupur", commodity: "Tamarind Fruit", variety: "Non A/c Flower", grade: "FAQ", arrival_date: "20/03/2025", min_price: 4320, max_price: 12500, modal_price: 6000 },
  { state: "Andhra Pradesh", district: "Anantapur", market: "Rayadurg", commodity: "Tamarind Fruit", variety: "Non A/c Flower", grade: "FAQ", arrival_date: "20/03/2025", min_price: 6300, max_price: 10300, modal_price: 10000 },
  { state: "Andhra Pradesh", district: "Chittor", market: "Madanapalli", commodity: "Tomato", variety: "Local", grade: "FAQ", arrival_date: "20/03/2025", min_price: 600, max_price: 1100, modal_price: 900 },
  { state: "Andhra Pradesh", district: "Chittor", market: "Palamaner", commodity: "Cluster beans", variety: "Cluster Beans", grade: "FAQ", arrival_date: "20/03/2025", min_price: 2000, max_price: 3000, modal_price: 2500 },
  { state: "Andhra Pradesh", district: "East Godavari", market: "Ravulapelem", commodity: "Banana", variety: "Bhushavali(Pacha)", grade: "Large", arrival_date: "20/03/2025", min_price: 1600, max_price: 2200, modal_price: 1600 },
  { state: "Andhra Pradesh", district: "East Godavari", market: "Ravulapelem", commodity: "Banana", variety: "Chakkarakeli(White)", grade: "Large", arrival_date: "20/03/2025", min_price: 2400, max_price: 3200, modal_price: 2900 },
  { state: "Andhra Pradesh", district: "East Godavari", market: "Ravulapelem", commodity: "Banana", variety: "Desi(Bontha)", grade: "Large", arrival_date: "20/03/2025", min_price: 1500, max_price: 2200, modal_price: 1800 },
  { state: "Andhra Pradesh", district: "Guntur", market: "Duggirala", commodity: "Turmeric", variety: "Finger", grade: "FAQ", arrival_date: "20/03/2025", min_price: 9150, max_price: 9950, modal_price: 9950 },
  { state: "Andhra Pradesh", district: "Guntur", market: "Guntur", commodity: "Chillies", variety: "Red", grade: "FAQ", arrival_date: "20/03/2025", min_price: 8000, max_price: 22000, modal_price: 15000 },
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
        const response = await axios.get('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd0000018f16d7edddc94f75618b4a2406497d3a&format=json');
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
        // Try cache first
        const cached = JSON.parse(localStorage.getItem('dashboard_cache') || 'null');
        if (cached) {
          setData(cached.data);
          setIsStale(true);
          setStaleTime(new Date(cached.timestamp).toLocaleString());
        } else {
          setData(processData(staticData));
          setIsStale(true);
          setStaleTime('Built-in sample data');
        }
        setError('Could not fetch live data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
                <span>Showing saved data from <strong>{staleTime}</strong></span>
                <button className="refresh-btn" onClick={() => window.location.reload()}>🔄 Refresh</button>
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
                  <option value="">All Markets</option>
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
                    <p className="highlight-market">{cheapest.market}</p>
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
                    <p className="highlight-market">{costliest.market}</p>
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
              <h2 className="section-title">📋 Detailed Prices</h2>
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