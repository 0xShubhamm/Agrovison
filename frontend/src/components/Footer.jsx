import { FaSeedling, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import './css/Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <FaSeedling className="footer-logo-icon" />
                <h3>AgroVision</h3>
              </div>
              <p className="footer-tagline">Empowering Farmers with Smart Technology 🌾</p>
              <div className="footer-helpline">
                <FaPhone className="helpline-icon" />
                <span>Kisan Helpline: <strong>1800-180-1551</strong></span>
              </div>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Facebook"><FaFacebook /></a>
                <a href="#" className="social-link" aria-label="Twitter"><FaTwitter /></a>
                <a href="#" className="social-link" aria-label="Instagram"><FaInstagram /></a>
                <a href="#" className="social-link" aria-label="LinkedIn"><FaLinkedin /></a>
              </div>
            </div>
            
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">🏠 Home</Link></li>
                <li><Link to="/about">📖 About Us</Link></li>
                <li><Link to="/services">🌾 Services</Link></li>
                <li><Link to="/help">❓ Help</Link></li>
                <li><Link to="/history">📅 Past Data</Link></li>
              </ul>
            </div>
            
            <div className="footer-links">
              <h4>Our Services</h4>
              <ul>
                <li><Link to="/services/weather">🌤 Weather Forecast</Link></li>
                <li><Link to="/services/crop-price-prediction">💰 Crop Price Prediction</Link></li>
                <li><Link to="/services/crop-analysis">🌱 Crop Analysis</Link></li>
                <li><Link to="/services/irrigation">💧 Irrigation</Link></li>
                <li><Link to="/services/dashboard">📊 Market Prices</Link></li>
              </ul>
            </div>
            
            <div className="footer-contact">
              <h4>Contact Us</h4>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <p>123 Farm Road, Agri Valley</p>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <p>info@agrovision.in</p>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <p>+91 12345 67890</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© 2025 AgroVision. Built with ❤️ for Indian Farmers</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer