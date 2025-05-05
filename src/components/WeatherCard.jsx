import React from 'react';
import { WiDaySunny, WiRain, WiCloudy, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi';

const getWeatherIcon = (weatherCode) => {
  if (weatherCode === 0 || weatherCode === 1) return <WiDaySunny />;
  if (weatherCode >= 51 && weatherCode <= 67) return <WiRain />;
  if (weatherCode >= 71 && weatherCode <= 77) return <WiSnow />;
  if (weatherCode >= 80 && weatherCode <= 82) return <WiRain />;
  if (weatherCode >= 85 && weatherCode <= 86) return <WiSnow />;
  if (weatherCode >= 95) return <WiThunderstorm />;
  if (weatherCode === 45 || weatherCode === 48) return <WiFog />;
  return <WiCloudy />;
};

const WeatherCard = ({ data }) => {
  const date = new Date(data.dt * 1000);
  
  return (
    <div className="weather-card">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{Math.round(data.temp)}°C</h2>
          <p className="text-gray-600">
            {date.toLocaleDateString('ru-RU', { weekday: 'long' })}
          </p>
        </div>
        <div className="weather-icon">
          {getWeatherIcon(data.weather[0].id)}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-700">{data.weather[0].description}</p>
        <div className="mt-2 text-sm text-gray-600">
          <p>Влажность: {data.humidity}%</p>
          <p>Ветер: {Math.round(data.wind_speed)} м/с</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard; 