import { useState } from 'react';
import PropTypes from "prop-types";
import Modal from 'react-modal';
import { WiThermometer, WiStrongWind, WiRaindrop, WiDaySunny } from 'react-icons/wi';

Modal.setAppElement('#root'); // For accessibility

function AirConditions({ weather }) {
  const { main, wind } = weather;
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <div className="air-conditions">
      <h3>AIR CONDITIONS</h3>
      <div className="conditions-grid">
        <div className="condition">
          <WiThermometer className="condition-icon" />
          <span>Real Feel</span>
          <span>{Math.round(main.feels_like)}°</span>
        </div>
        <div className="condition">
          <WiStrongWind className="condition-icon" />
          <span>Wind</span>
          <span>{wind.speed.toFixed(1)} km/h</span>
        </div>
        <div className="condition">
          <WiRaindrop className="condition-icon" />
          <span>Chance of rain</span>
          <span>0%</span> {/* Placeholder, enhance with API data if needed */}
        </div>
        <div className="condition">
          <WiDaySunny className="condition-icon" />
          <span>UV Index</span>
          <span>3</span> {/* Placeholder, enhance with API data */}
        </div>
      </div>
      <button className="see-more" onClick={openModal}>See more</button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            background: '#16213e',
            borderRadius: '15px',
            border: 'none',
            padding: '2rem',
            color: '#ffffff',
            maxWidth: '90%',
            maxHeight: '80%',
            overflow: 'auto',
          },
        }}
      >
        <h2>Additional Air Conditions</h2>
        <div className="modal-content">
          <p><WiThermometer className="condition-icon" /> Pressure: {main.pressure} hPa</p>
          <p><WiStrongWind className="condition-icon" /> Visibility: 10 km (Placeholder)</p>
          <p><WiRaindrop className="condition-icon" /> Humidity: {main.humidity}%</p>
          <p><WiDaySunny className="condition-icon" /> Dew Point: 20°C (Placeholder)</p>
        </div>
        <button className="close-modal" onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
}

AirConditions.propTypes = {
  weather: PropTypes.shape({
    wind: PropTypes.object,
    main: PropTypes.object,
  }),
};

export default AirConditions;