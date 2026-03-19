import Footer from '../components/Footer';
import './About.css';

const About = () => {
  return (
    <main className="about-page">
      <section className="hero about-hero">
        <div className="container hero-content">
          <h1 className="hero-title">📖 About AgroVision</h1>
          <p className="hero-subtitle">
            Built by farmers, for farmers – empowering Indian agriculture with smart technology
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-info">
              <h2 className="about-heading">🌾 Our Mission</h2>
              <p className="about-text">
                AgroVision was created to help Indian farmers make smarter decisions. Whether it's 
                knowing when to plant, how much to irrigate, or where to sell your crop at the best 
                price — we bring all this information to your fingertips.
              </p>
              <p className="about-text">
                We believe that every farmer deserves access to the same data and technology that big 
                agricultural businesses use. That's why AgroVision is free, simple, and works even 
                when your internet connection is slow.
              </p>
            </div>
            <div className="about-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80"
                alt="Indian farmland"
                className="about-img"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section values-section">
        <div className="container">
          <h2 className="section-title">What We Stand For</h2>
          <div className="values-grid">
            <div className="value-card">
              <span className="value-emoji">🤝</span>
              <h3>Farmer First</h3>
              <p>Every feature is designed with the farmer in mind — simple language, big buttons, works on basic phones.</p>
            </div>
            <div className="value-card">
              <span className="value-emoji">📊</span>
              <h3>Data You Can Trust</h3>
              <p>We use government data, weather APIs, and trained AI models to give accurate predictions.</p>
            </div>
            <div className="value-card">
              <span className="value-emoji">🌍</span>
              <h3>Sustainable Farming</h3>
              <p>Our tools help you use less water, reduce fertilizer waste, and protect your soil.</p>
            </div>
            <div className="value-card">
              <span className="value-emoji">📱</span>
              <h3>Offline Friendly</h3>
              <p>Data gets saved on your device so you can see it later — even without internet.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;