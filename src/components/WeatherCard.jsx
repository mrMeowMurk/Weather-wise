import React from 'react';
import { WiSunrise, WiSunset } from 'react-icons/wi';

const WeatherCard = ({ data }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '--:--';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="weather-card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Сейчас</h2>
          <div className="flex items-center">
            <div className="weather-icon mr-4">
              {/* Здесь можно добавить иконку погоды */}
            </div>
            <div>
              <p className="text-5xl font-bold">{Math.round(data.temp)}°</p>
              <p className="text-xl text-gray-600">
                {data.weather[0].description}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <WiSunrise className="text-3xl text-yellow-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Восход</p>
                <p className="font-semibold">{formatTime(data.sunrise)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <WiSunset className="text-3xl text-orange-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Закат</p>
                <p className="font-semibold">{formatTime(data.sunset)}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Ощущается как</p>
              <p className="font-semibold">{Math.round(data.apparent_temperature)}°</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Влажность</p>
              <p className="font-semibold">{data.humidity}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ветер</p>
              <p className="font-semibold">{Math.round(data.wind_speed)} м/с</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Давление</p>
              <p className="font-semibold">{Math.round(data.pressure)} гПа</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard; 