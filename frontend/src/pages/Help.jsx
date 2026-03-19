import { useState } from 'react';
import Footer from '../components/Footer';
import './Help.css';

const faqs = [
  {
    q: '🌤️ How do I check the weather?',
    a: 'Go to Services → Weather Forecast. Type your city name and press Enter. You\'ll see temperature, rain chance, wind, and a weekly forecast.'
  },
  {
    q: '💰 How does price prediction work?',
    a: 'Go to Services → Crop Price Prediction. Select your crop, state, district, and field size. Our AI model will predict the price and tell you the best place to sell.'
  },
  {
    q: '📊 Where can I see today\'s mandi prices?',
    a: 'Go to "Today\'s Prices" in the top menu or Services → Market Prices. You can filter by crop name or market to find what you need.'
  },
  {
    q: '📅 What happens when the internet is slow?',
    a: 'Don\'t worry! AgroVision saves your data on your phone/computer. You can always see the last fetched data in the "Past Data" section, even offline.'
  },
  {
    q: '💧 How do I calculate irrigation needs?',
    a: 'Go to Services → Irrigation Planner. Select your crop type, farm area, irrigation method, season, and motor power. We\'ll calculate how much water and time you need.'
  },
  {
    q: '🌱 What is crop analysis?',
    a: 'Crop Analysis helps you understand the best planting time, fertilizer recommendations, water requirements, and pest risk for your specific crop and area.'
  },
  {
    q: '🔐 Is my data safe?',
    a: 'Yes! Your data is saved only on your device. We use Google login for security, and we don\'t sell or share your information.'
  },
  {
    q: '📱 Does this work on my phone?',
    a: 'Yes! AgroVision works on any phone, tablet, or computer with a web browser. No app download needed.'
  },
];

const Help = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <main className="help-page">
      <section className="hero help-hero">
        <div className="container hero-content">
          <h1 className="hero-title">❓ Help & Support</h1>
          <p className="hero-subtitle">
            Find answers to common questions – we're here to help every farmer
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container help-content">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Tap any question to see the answer</p>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`faq-item ${openIndex === idx ? 'open' : ''}`}>
                <div className="faq-question" onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
                  <span>{faq.q}</span>
                  <span className="faq-toggle">{openIndex === idx ? '−' : '+'}</span>
                </div>
                {openIndex === idx && (
                  <div className="faq-answer">{faq.a}</div>
                )}
              </div>
            ))}
          </div>

          <div className="help-contact-card">
            <span className="help-contact-emoji">📞</span>
            <div>
              <h3>Still need help?</h3>
              <p>Call Kisan Helpline: <strong>1800-180-1551</strong> (Toll Free)</p>
              <p>Or email us at: <strong>help@agrovision.in</strong></p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Help;