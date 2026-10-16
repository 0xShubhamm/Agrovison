import { WiDaySunny, WiCloudy, WiRain } from 'react-icons/wi';
import PropTypes from 'prop-types';
// import 'D:/CPP Project/project/src/pages/WeatherForecast.css';

function WeeklyForecast({ forecast }) {
  // Group forecast by day for 7-day forecast
  const dailyForecast = {};
  forecast.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    if (!dailyForecast[day]) {
      dailyForecast[day] = item;
    }
  });

  const days = Object.values(dailyForecast).slice(0, 7); // Get 7 days

  // Map OpenWeatherMap weather conditions to react-icons
  const getWeatherIcon = (condition) => {
    const mainCondition = condition.toLowerCase();
    if (mainCondition.includes('clear')) return <WiDaySunny size={40} />;
    if (mainCondition.includes('cloud')) return <WiCloudy size={40} />;
    if (mainCondition.includes('rain')) return <WiRain size={40} />;
    return <WiDaySunny size={40} />; // Default to sunny
  };

  return (
    <div className="weekly-forecast">
      <h3>UPCOMING FORECAST</h3>
      <div className="weekly-grid">
        {days.map((item, index) => (
          <div key={index} className="weekly-item">
            <span>{new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</span>
            {getWeatherIcon(item.weather[0].main)}
            <span>{Math.round(item.main.temp)}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}

WeeklyForecast.propTypes = {
  forecast: PropTypes.arrayOf(
    PropTypes.shape({
      dt: PropTypes.number,
      main: PropTypes.shape({
        temp: PropTypes.number,
      }),
      weather: PropTypes.arrayOf(
        PropTypes.shape({
          main: PropTypes.string,
        })
      ),
    })
  ),
};

export default WeeklyForecast;