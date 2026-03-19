import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './App.css';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Help from './pages/Help';
import Login from './pages/Login';
import WeatherForecast from './pages/WeatherForecast';
import CropAnalysis from './pages/CropAnalysis';
import PricePrediction from './pages/PricePrediction';
import Irrigation from './pages/Irrigation';
import DashBoard from './pages/DashBoard';
import History from './pages/History';

// Components
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check Firebase auth
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Check if guest user exists in localStorage
        const guestUser = localStorage.getItem('user');
        if (guestUser) {
          try {
            const parsed = JSON.parse(guestUser);
            setUser({ email: 'Guest', displayName: `${parsed.firstName} ${parsed.lastName}`, isGuest: true });
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    // Listen for guest login events (from Login page dispatching storage event)
    const handleStorageChange = () => {
      const guestUser = localStorage.getItem('user');
      if (guestUser) {
        try {
          const parsed = JSON.parse(guestUser);
          setUser({ email: 'Guest', displayName: `${parsed.firstName} ${parsed.lastName}`, isGuest: true });
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const isAuthenticated = !!user;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="growing"></div>
        <p className="loading-text">AgroVision</p>
      </div>
    );
  }

  return (
    <Router>
      {isAuthenticated && <Navbar user={user} />}
      <Routes>
        {/* Public pages */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />

        {/* Protected pages */}
        <Route path="/" element={isAuthenticated ? <Home user={user} /> : <Navigate to="/login" />} />
        <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/login" />} />
        <Route path="/services" element={isAuthenticated ? <Services /> : <Navigate to="/login" />} />
        <Route path="/help" element={isAuthenticated ? <Help /> : <Navigate to="/login" />} />
        <Route path="/history" element={isAuthenticated ? <History /> : <Navigate to="/login" />} />

        {/* Service pages – protected */}
        <Route path="/services/weather" element={isAuthenticated ? <WeatherForecast /> : <Navigate to="/login" />} />
        <Route path="/services/crop-analysis" element={isAuthenticated ? <CropAnalysis /> : <Navigate to="/login" />} />
        <Route path="/services/crop-price-prediction" element={isAuthenticated ? <PricePrediction /> : <Navigate to="/login" />} />
        <Route path="/services/irrigation" element={isAuthenticated ? <Irrigation /> : <Navigate to="/login" />} />
        <Route path="/services/dashboard" element={isAuthenticated ? <DashBoard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;