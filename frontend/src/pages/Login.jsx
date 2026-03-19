import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSeedling, FaGoogle, FaUser } from 'react-icons/fa';
import { loginWithGoogle } from '../firebase';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('options');
  const [formData, setFormData] = useState({ firstName: '', lastName: '', region: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const { user, error } = await loginWithGoogle();
    if (error) setError(error);
    else setStep('form');
    setLoading(false);
  };

  const handleGuestLogin = () => setStep('form');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.region) {
      setError('Please fill all fields');
      return;
    }
    localStorage.setItem('user', JSON.stringify({ ...formData, type: 'guest' }));
    window.dispatchEvent(new Event("storage"));
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-3">
          <div className="logo-container">
            <FaSeedling className="logo-icon" />
          </div>
          <h1 className="logo-text">AgroVision</h1>
          <p className="logo-tagline">Smart Farming for Every Farmer 🌾</p>
        </div>

        {step === 'options' && (
          <>
            <h2 className="auth-title">Welcome!</h2>
            <p className="auth-subtitle">Choose how you want to continue</p>

            {error && <div className="error-message">⚠️ {error}</div>}

            <button className="auth-btn google-btn" onClick={handleGoogleLogin} disabled={loading}>
              <FaGoogle /> Continue with Google
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <button className="auth-btn guest-btn" onClick={handleGuestLogin}>
              <FaUser /> Continue as Guest
            </button>
          </>
        )}

        {step === 'form' && (
          <>
            <h2 className="auth-title">Tell Us About Yourself</h2>
            <p className="auth-subtitle">This helps us show you the right data</p>

            {error && <div className="error-message">⚠️ {error}</div>}

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">👤 First Name</label>
                <input type="text" name="firstName" className="form-control" placeholder="e.g. Ramesh" value={formData.firstName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">👤 Last Name</label>
                <input type="text" name="lastName" className="form-control" placeholder="e.g. Patel" value={formData.lastName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">📍 Village / City</label>
                <input type="text" name="region" className="form-control" placeholder="e.g. Anand, Gujarat" value={formData.region} onChange={handleChange} />
              </div>
              <button type="submit" className="auth-btn">🚀 Let's Get Started</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;