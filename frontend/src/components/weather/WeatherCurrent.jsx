import { WiDaySunny, WiCloudy, WiRain } from 'react-icons/wi';
import PropTypes from 'prop-types';

function WeatherCurrent({ weather }) {
  const { name, main, weather: weatherDetails } = weather;

  // Map OpenWeatherMap weather conditions to react-icons
  const getWeatherIcon = (condition) => {
    const mainCondition = condition.toLowerCase();
    if (mainCondition.includes('clear')) return <WiDaySunny size={80} />;
    if (mainCondition.includes('cloud')) return <WiCloudy size={80} />;
    if (mainCondition.includes('rain')) return <WiRain size={80} />;
    return <WiDaySunny size={80} />; // Default to sunny
  };

  return (
    <div className="weather-currentt">
    <h2>{name}</h2>
    {/* <p>Chance of rain: {pop}%</p> Display real chance of rain */}
    <div className="current-temp">
      <span className="temp">{Math.round(main.temp)}°</span>
      {getWeatherIcon(weatherDetails[0].main)}
    </div>
  </div>
  );
}

WeatherCurrent.propTypes = {
  weather: PropTypes.shape({
    name: PropTypes.string,
    main: PropTypes.shape({
      temp: PropTypes.number,
    }),
    weather: PropTypes.arrayOf(
      PropTypes.shape({
        main: PropTypes.string,
      })
    ),
  }),
};

export default WeatherCurrent;