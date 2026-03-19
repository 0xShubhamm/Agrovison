import { Link } from 'react-router-dom'
import { FaCloudSun, FaRupeeSign, FaSeedling, FaTint, FaChartBar, FaHistory } from 'react-icons/fa'
import Footer from '../components/Footer'
import './Home.css'

const Home = ({ user }) => {
  const firstName = user?.displayName?.split(' ')[0] || 
                    JSON.parse(localStorage.getItem('user') || '{}')?.firstName || 
                    'Farmer';

  const quickActions = [
    { to: '/services/weather', icon: '🌤️', title: 'Weather', desc: 'Check today\'s weather & forecast', color: '#457B9D' },
    { to: '/services/crop-price-prediction', icon: '💰', title: 'Crop Prices', desc: 'Predict prices for your crop', color: '#E76F51' },
    { to: '/services/crop-analysis', icon: '🌱', title: 'Crop Analysis', desc: 'Get crop growing advice', color: '#2D6A4F' },
    { to: '/services/irrigation', icon: '💧', title: 'Irrigation', desc: 'Plan water usage smartly', color: '#0077B6' },
    { to: '/services/dashboard', icon: '📊', title: 'Market Prices', desc: 'See today\'s mandi rates', color: '#8B6F47' },
    { to: '/history', icon: '📅', title: 'Past Data', desc: 'View previous day\'s data', color: '#6B705C' },
  ];

  return (
    <main className="home-page">

      {/* HERO */}
      <section className="hero home-hero">
        <div className="container hero-content">
          <h1 className="hero-title">
            Welcome, {firstName}! 🌾
          </h1>
          <p className="hero-subtitle">
            AgroVision helps you grow better crops, get fair prices, and plan your 
            farm smartly using technology.
          </p>
          <Link to="/services" className="hero-btn">
            🌾 Explore All Services
          </Link>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="section quick-actions-section">
        <div className="container">
          <h2 className="section-title">What would you like to do?</h2>
          <p className="section-subtitle">
            Tap any option below to get started – it's simple and fast!
          </p>
          
          <div className="quick-actions-grid">
            {quickActions.map((action, idx) => (
              <Link to={action.to} key={idx} className="quick-action-card" style={{'--card-accent': action.color}}>
                <div className="qa-icon">{action.icon}</div>
                <div className="qa-text">
                  <h3>{action.title}</h3>
                  <p>{action.desc}</p>
                </div>
                <span className="qa-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="section features-section">
        <div className="container">
          <h2 className="section-title">Why Farmers Love AgroVision</h2>
          <p className="section-subtitle">
            Simple tools that help you earn more and farm smarter
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-emoji">🌿</div>
              <h3>Better Farming</h3>
              <p>Get expert advice for growing healthier crops and protecting soil quality.</p>
            </div>
            <div className="feature-card">
              <div className="feature-emoji">📈</div>
              <h3>Fair Prices</h3>
              <p>Know market prices before selling – don't get cheated by middlemen.</p>
            </div>
            <div className="feature-card">
              <div className="feature-emoji">🌦️</div>
              <h3>Weather Alerts</h3>
              <p>Plan ahead with accurate weather forecasts for your area.</p>
            </div>
            <div className="feature-card">
              <div className="feature-emoji">💧</div>
              <h3>Save Water</h3>
              <p>Use irrigation smartly – know exactly how much water your crop needs.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Home