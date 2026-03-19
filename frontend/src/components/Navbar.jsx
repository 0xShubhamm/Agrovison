import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaSeedling } from "react-icons/fa";
import { logoutUser } from "../firebase";
import "./css/Navbar.css";

const Navbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    // Clear guest user data
    localStorage.removeItem('user');
    window.dispatchEvent(new Event("storage"));
    
    const { error } = await logoutUser();
    setDropdownOpen(false);
    window.scrollTo(0, 0);
    // Force reload to reset all state
    window.location.href = '/login';
  };

  const [avatarColor] = useState(() => {
    const colors = ["#2D6A4F", "#E76F51", "#457B9D", "#8B6F47", "#264653"];
    return colors[Math.floor(Math.random() * colors.length)];
  });

  const getInitial = () => {
    return user && user.email ? user.email.charAt(0).toUpperCase() : "U";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".avatar-container")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "🏠 Home" },
    { to: "/services", label: "🌾 Services" },
    { to: "/services/dashboard", label: "📊 Today's Prices" },
    { to: "/history", label: "📅 Past Data" },
    { to: "/about", label: "📖 About" },
    { to: "/help", label: "❓ Help" },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <FaSeedling className="navbar-logo-icon" />
          <span>AgroVision</span>
        </Link>

        <div className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`navbar-menu ${isOpen ? "active" : ""}`}>
          {navLinks.map((link) => (
            <li key={link.to} className="navbar-item">
              <Link
                to={link.to}
                className={`navbar-link ${location.pathname === link.to ? "active" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {user && (
            <li className="navbar-item avatar-container">
              <button
                className="avatar-button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ backgroundColor: avatarColor }}
              >
                {getInitial()}
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-user-info">
                    <span className="dropdown-email">{user.email || 'Guest'}</span>
                  </div>
                  <button className="dropdown-logout" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;