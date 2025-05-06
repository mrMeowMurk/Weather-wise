import React from 'react';
import { WiSunrise, WiSunset, WiStrongWind } from 'react-icons/wi';
import { FaTemperatureHigh } from 'react-icons/fa';
import { MdAir } from 'react-icons/md';

const WeatherExtras = ({ data }) => {
  const getUVIndexLevel = (uvIndex) => {
    if (uvIndex <= 2) return { level: 'Низкий', color: 'text-green-500' };
    if (uvIndex <= 5) return { level: 'Умеренный', color: 'text-yellow-500' };
    if (uvIndex <= 7) return { level: 'Высокий', color: 'text-orange-500' };
    return { level: 'Очень высокий', color: 'text-red-500' };
  };

  const getAirQualityLevel = (aqi) => {
    if (aqi <= 50) return { level: 'Хорошее', color: 'text-green-500' };
    if (aqi <= 100) return { level: 'Умеренное', color: 'text-yellow-500' };
    if (aqi <= 150) return { level: 'Вредное для чувствительных групп', color: 'text-orange-500' };
    return { level: 'Вредное', color: 'text-red-500' };
  };

  const uvInfo = getUVIndexLevel(data.uv_index || 0);
  const airQualityInfo = getAirQualityLevel(data.air_quality || 0);

  return (
    <div className="glass-card p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4">Дополнительная информация</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-center mb-2">
            <FaTemperatureHigh className="text-2xl text-yellow-500 mr-2" />
            <span className="font-medium">УФ Индекс</span>
          </div>
          <div className={`text-lg font-bold ${uvInfo.color}`}>
            {data.uv_index || 0}
          </div>
          <div className="text-sm text-gray-600">{uvInfo.level}</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-center mb-2">
            <MdAir className="text-2xl text-blue-500 mr-2" />
            <span className="font-medium">Качество воздуха</span>
          </div>
          <div className={`text-lg font-bold ${airQualityInfo.color}`}>
            {data.air_quality || 0}
          </div>
          <div className="text-sm text-gray-600">{airQualityInfo.level}</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-center mb-2">
            <WiSunrise className="text-2xl text-orange-500 mr-2" />
            <span className="font-medium">Восход</span>
          </div>
          <div className="text-lg">
            {new Date(data.sunrise * 1000).toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-center mb-2">
            <WiSunset className="text-2xl text-purple-500 mr-2" />
            <span className="font-medium">Закат</span>
          </div>
          <div className="text-lg">
            {new Date(data.sunset * 1000).toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherExtras; 