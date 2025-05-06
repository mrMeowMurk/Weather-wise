import React from 'react';
import { WiHumidity, WiStrongWind, WiBarometer, WiSunrise, WiSunset, WiThermometer } from 'react-icons/wi';

const WeatherStats = ({ data }) => {
  return (
    <div className="weather-stats">
      <div className="stat-card">
        <WiStrongWind className="text-4xl text-blue-500 mx-auto mb-2" />
        <h3 className="text-lg font-semibold mb-1">Ветер</h3>
        <p className="text-2xl font-bold">{Math.round(data.wind_speed)} м/с</p>
        <p className="text-sm text-gray-600">
          Направление: {data.wind_direction}°
        </p>
      </div>

      <div className="stat-card">
        <WiHumidity className="text-4xl text-blue-500 mx-auto mb-2" />
        <h3 className="text-lg font-semibold mb-1">Влажность</h3>
        <p className="text-2xl font-bold">{data.humidity}%</p>
        <p className="text-sm text-gray-600">
          Ощущается как {Math.round(data.apparent_temperature)}°
        </p>
      </div>

      <div className="stat-card">
        <WiBarometer className="text-4xl text-blue-500 mx-auto mb-2" />
        <h3 className="text-lg font-semibold mb-1">Давление</h3>
        <p className="text-2xl font-bold">{Math.round(data.pressure)} гПа</p>
        <p className="text-sm text-gray-600">
          {Math.round(data.pressure * 0.75006375541921)} мм рт.ст.
        </p>
      </div>

      <div className="stat-card">
        <WiSunrise className="stat-icon" />
        <div>
          <p className="text-gray-600">Восход</p>
          <p className="font-semibold">
            {new Date(data.sunrise * 1000).toLocaleTimeString('ru-RU', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>

      <div className="stat-card">
        <WiSunset className="stat-icon" />
        <div>
          <p className="text-gray-600">Закат</p>
          <p className="font-semibold">
            {new Date(data.sunset * 1000).toLocaleTimeString('ru-RU', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherStats; 