import { WiDaySunny, WiCloudy, WiRain } from 'react-icons/wi';
import PropTypes from 'prop-types';

function HourlyForecast({ forecast }) {
  // Filter for today's forecast, showing 20:00 and 23:00 (8 PM and 11 PM)
  const todayForecast = forecast.filter(item => 
    new Date(item.dt * 1000).toDateString() === new Date().toDateString()
  ).filter(item => 
    [20, 23].includes(new Date(item.dt * 1000).getHours())
  );

  // Map OpenWeatherMap weather conditions to react-icons
  const getWeatherIcon = (condition) => {
    const mainCondition = condition.toLowerCase();
    if (mainCondition.includes('clear')) return <WiDaySunny size={40} />;
    if (mainCondition.includes('cloud')) return <WiCloudy size={40} />;
    if (mainCondition.includes('rain')) return <WiRain size={40} />;
    return <WiDaySunny size={40} />; // Default to sunny
  };

  return (
    <div className="hourly-forecast">
      <h3>TODAY’S FORECAST</h3>
      <div className="hourly-grid">
        {todayForecast.map((item, index) => (
          <div key={index} className="hourly-item">
            <span>{new Date(item.dt * 1000).getHours()}:00</span>
            {getWeatherIcon(item.weather[0].main)}
            <span>{Math.round(item.main.temp)}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}

HourlyForecast.propTypes = {
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

export default HourlyForecast;































// import { WiDaySunny, WiCloudy, WiRain } from 'react-icons/wi';

// function HourlyForecast({ forecast }) {
//   // Filter for today's forecast, showing 18:00 and 21:00 (closest to 8 PM and 11 PM in 3-hour intervals)
//   const todayForecast = forecast.filter(item => 
//     new Date(item.dt * 1000).toDateString() === new Date().toDateString()
//   ).filter(item => 
//     [18, 21].includes(new Date(item.dt * 1000).getUTCHours()) // Use UTC hours for consistency
//   );

//   // If 18:00 or 21:00 aren't available, fall back to the last two entries of the day
//   const fallbackForecast = forecast.filter(item => 
//     new Date(item.dt * 1000).toDateString() === new Date().toDateString()
//   ).slice(-2); // Get the last two 3-hour intervals of the day

//   const finalForecast = todayForecast.length === 2 ? todayForecast : fallbackForecast;

//   // Map OpenWeatherMap weather conditions to react-icons
//   const getWeatherIcon = (condition) => {
//     const mainCondition = condition.toLowerCase();
//     if (mainCondition.includes('clear')) return <WiDaySunny size={40} />;
//     if (mainCondition.includes('cloud')) return <WiCloudy size={40} />;
//     if (mainCondition.includes('rain')) return <WiRain size={40} />;
//     return <WiDaySunny size={40} />; // Default to sunny
//   };

//   return (
//     <div className="hourly-forecast">
//       <h3>TODAY’S FORECAST</h3>
//       <div className="hourly-grid">
//         {finalForecast.map((item, index) => (
//           <div key={index} className="hourly-item">
//             <span>{new Date(item.dt * 1000).getUTCHours()}:00</span> {/* Use UTC for consistency */}
//             {getWeatherIcon(item.weather[0].main)}
//             <span>{Math.round(item.main.temp)}°</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default HourlyForecast;