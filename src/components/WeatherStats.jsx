import React from 'react';
import { WiHumidity, WiStrongWind, WiBarometer, WiSunrise, WiSunset, WiThermometer } from 'react-icons/wi';

const WeatherStats = ({ data }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      <div className="stat-card">
        <WiThermometer className="stat-icon" />
        <div>
          <p className="text-gray-600">Ощущается как</p>
          <p className="font-semibold">{Math.round(data.apparent_temperature)}°C</p>
        </div>
      </div>
      
      <div className="stat-card">
        <WiHumidity className="stat-icon" />
        <div>
          <p className="text-gray-600">Влажность</p>
          <p className="font-semibold">{data.humidity}%</p>
        </div>
      </div>

      <div className="stat-card">
        <WiStrongWind className="stat-icon" />
        <div>
          <p className="text-gray-600">Ветер</p>
          <p className="font-semibold">{Math.round(data.wind_speed)} м/с</p>
        </div>
      </div>

      <div className="stat-card">
        <WiBarometer className="stat-icon" />
        <div>
          <p className="text-gray-600">Давление</p>
          <p className="font-semibold">{Math.round(data.pressure)} гПа</p>
        </div>
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