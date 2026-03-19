import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './Services.css';

const services = [
  {
    emoji: '🌤️',
    title: 'Weather Forecast',
    desc: 'Check the weather before going to the field. Get rain alerts, temperature, and wind information for your area.',
    features: ['Real-time weather data', 'Temperature & humidity', 'Rain & wind alerts', 'Weekly forecast'],
    link: '/services/weather',
    cta: 'Check Weather →',
    img: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=800&q=80',
  },
  {
    emoji: '🌱',
    title: 'Crop Analysis',
    desc: 'Get advice on which crop to grow, when to plant, how much fertilizer and water your crop needs.',
    features: ['Best planting time', 'Fertilizer advice', 'Water requirements', 'Pest & disease risk'],
    link: '/services/crop-analysis',
    cta: 'Analyze Crop →',
    img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
  },
  {
    emoji: '💧',
    title: 'Irrigation Planner',
    desc: 'Know how much water, time, and energy your farm needs. Save water and electricity bills.',
    features: ['Water needed (cubic meters)', 'Irrigation time', 'Energy usage', 'System efficiency'],
    link: '/services/irrigation',
    cta: 'Plan Irrigation →',
    img: 'https://images.unsplash.com/photo-1584479898061-15742e14f50d?auto=format&fit=crop&w=800&q=80',
  },
  {
    emoji: '💰',
    title: 'Crop Price Prediction',
    desc: 'Find out what price your crop will get. Know the best time and place to sell for maximum profit.',
    features: ['Price prediction', 'Best market to sell', 'Storage advice', 'Revenue estimate'],
    link: '/services/crop-price-prediction',
    cta: 'Predict Price →',
    img: 'https://images.unsplash.com/photo-1620200423727-8127f75d7f53?auto=format&fit=crop&w=800&q=80',
  },
  {
    emoji: '📊',
    title: 'Market Prices (Mandi)',
    desc: 'See today\'s mandi prices from across India. Compare prices of crops in different markets.',
    features: ['Live mandi prices', 'Market comparison', 'Price charts', 'Crop filters'],
    link: '/services/dashboard',
    cta: 'See Prices →',
    img: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80',
  },
];

const steps = [
  { num: '1', emoji: '📱', title: 'Open AgroVision', desc: 'Login or continue as guest – no complicated setup needed.' },
  { num: '2', emoji: '🎯', title: 'Choose a Service', desc: 'Pick what you need – weather, prices, crop advice, or irrigation.' },
  { num: '3', emoji: '📝', title: 'Enter Your Details', desc: 'Fill in your crop, location, and farm size – simple forms, big dropdowns.' },
  { num: '4', emoji: '✅', title: 'Get Results', desc: 'Instant results with clear advice you can act on immediately.' },
];

const Services = () => {
  return (
    <main className="services-page">
      <section className="hero services-hero">
        <div className="container hero-content">
          <h1 className="hero-title">🌾 Our Services</h1>
          <p className="hero-subtitle">
            Simple, powerful tools to help you farm smarter and earn more
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">How We Help You</h2>
          <p className="section-subtitle">
            Every tool is designed to be easy to use – even on a basic phone
          </p>

          <div className="services-list">
            {services.map((service, idx) => (
              <div key={idx} className={`service-row ${idx % 2 !== 0 ? 'reversed' : ''}`}>
                <div className="service-info">
                  <div className="service-header">
                    <span className="service-emoji">{service.emoji}</span>
                    <h3 className="service-title">{service.title}</h3>
                  </div>
                  <p className="service-text">{service.desc}</p>
                  <ul className="service-features">
                    {service.features.map((f, i) => (
                      <li key={i}>✓ {f}</li>
                    ))}
                  </ul>
                  <Link to={service.link} className="btn btn-primary">{service.cta}</Link>
                </div>
                <div className="service-image-wrapper">
                  <img src={service.img} alt={service.title} className="service-image" loading="lazy" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">4 simple steps to get started</p>
          
          <div className="steps-grid">
            {steps.map((step, idx) => (
              <div key={idx} className="step-card">
                <div className="step-number">{step.num}</div>
                <div className="step-emoji">{step.emoji}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-text">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Services;