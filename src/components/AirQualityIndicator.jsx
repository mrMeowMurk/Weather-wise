import React from 'react';
import { WiBarometer, WiHumidity } from 'react-icons/wi';
import { MdAir } from 'react-icons/md';

const AirQualityIndicator = ({ pressure, humidity }) => {
  // Расчет индекса качества воздуха на основе давления и влажности
  const calculateAirQuality = () => {
    // Нормализация давления (нормальное давление около 1013.25 гПа)
    const pressureScore = Math.max(0, Math.min(100, 
      100 - Math.abs(pressure - 1013.25) / 10
    ));

    // Нормализация влажности (оптимальная влажность 40-60%)
    const humidityScore = Math.max(0, Math.min(100,
      100 - Math.abs(humidity - 50) * 2
    ));

    // Общий индекс качества воздуха
    return Math.round((pressureScore + humidityScore) / 2);
  };

  const airQualityIndex = calculateAirQuality();

  // Определение цвета и описания на основе индекса
  const getQualityInfo = (index) => {
    if (index >= 80) return { color: '#22C55E', text: 'Отличное', gradient: 'from-green-400 to-green-500' };
    if (index >= 60) return { color: '#84CC16', text: 'Хорошее', gradient: 'from-lime-400 to-lime-500' };
    if (index >= 40) return { color: '#EAB308', text: 'Умеренное', gradient: 'from-yellow-400 to-yellow-500' };
    if (index >= 20) return { color: '#F97316', text: 'Низкое', gradient: 'from-orange-400 to-orange-500' };
    return { color: '#EF4444', text: 'Плохое', gradient: 'from-red-400 to-red-500' };
  };

  const qualityInfo = getQualityInfo(airQualityIndex);

  return (
    <div className="relative overflow-hidden backdrop-blur-md bg-gradient-to-br from-white/90 to-white/70 rounded-2xl p-6">
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-300/20 rounded-full blur-2xl transform translate-x-16 -translate-y-8"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-400/20 to-pink-300/20 rounded-full blur-2xl transform -translate-x-16 translate-y-8"></div>

      <div className="relative z-10">
        {/* Заголовок */}
        <div className="flex items-center space-x-3 mb-6">
          <MdAir className="text-3xl text-blue-500" />
          <h3 className="text-2xl font-bold text-gray-800">Качество воздуха</h3>
        </div>

        {/* Основной индикатор */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative w-40 h-40">
            {/* Круговой индикатор */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="8"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke={qualityInfo.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${airQualityIndex * 4.4} 440`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            {/* Центральное значение */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-800">{airQualityIndex}</span>
              <span className="text-sm text-gray-500">из 100</span>
            </div>
          </div>

          {/* Текстовая информация */}
          <div className="flex-1 ml-8">
            <div className="mb-4">
              <p className="text-lg text-gray-600">Состояние</p>
              <p className="text-2xl font-bold" style={{ color: qualityInfo.color }}>
                {qualityInfo.text}
              </p>
            </div>
          </div>
        </div>

        {/* Метрики */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/50 rounded-xl p-4 backdrop-blur-sm transition-all hover:bg-white/60">
            <div className="flex items-center space-x-3 mb-2">
              <WiBarometer className="text-2xl text-indigo-500" />
              <span className="text-gray-600">Давление</span>
            </div>
            <p className="text-xl font-semibold text-gray-800">{Math.round(pressure)} гПа</p>
            <p className="text-sm text-gray-500">
              {Math.round(pressure * 0.75006375541921)} мм рт.ст.
            </p>
          </div>

          <div className="bg-white/50 rounded-xl p-4 backdrop-blur-sm transition-all hover:bg-white/60">
            <div className="flex items-center space-x-3 mb-2">
              <WiHumidity className="text-2xl text-teal-500" />
              <span className="text-gray-600">Влажность</span>
            </div>
            <p className="text-xl font-semibold text-gray-800">{humidity}%</p>
            <p className="text-sm text-gray-500">
              {humidity < 40 ? 'Низкая' : humidity > 60 ? 'Высокая' : 'Оптимальная'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirQualityIndicator; 