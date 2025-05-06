import React from 'react';

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
    if (index >= 80) return { color: '#4CAF50', text: 'Отличное' };
    if (index >= 60) return { color: '#8BC34A', text: 'Хорошее' };
    if (index >= 40) return { color: '#FFC107', text: 'Умеренное' };
    if (index >= 20) return { color: '#FF9800', text: 'Низкое' };
    return { color: '#F44336', text: 'Плохое' };
  };

  const qualityInfo = getQualityInfo(airQualityIndex);

  return (
    <div className="air-quality-card stat-card">
      <h3 className="text-lg font-semibold mb-4">Качество воздуха</h3>
      
      <div className="relative w-32 h-32 mx-auto mb-4">
        {/* Круговой индикатор */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={qualityInfo.color}
            strokeWidth="8"
            strokeDasharray={`${airQualityIndex * 2.83} 283`}
            transform="rotate(-90 50 50)"
            style={{
              transition: 'stroke-dasharray 0.5s ease'
            }}
          />
          <text
            x="50"
            y="45"
            textAnchor="middle"
            fill="#333"
            fontSize="20"
            fontWeight="bold"
          >
            {airQualityIndex}
          </text>
          <text
            x="50"
            y="65"
            textAnchor="middle"
            fill="#666"
            fontSize="12"
          >
            из 100
          </text>
        </svg>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold" style={{ color: qualityInfo.color }}>
          {qualityInfo.text}
        </p>
        <div className="mt-2 text-sm text-gray-600">
          <p>Давление: {Math.round(pressure)} гПа</p>
          <p>Влажность: {Math.round(humidity)}%</p>
        </div>
      </div>
    </div>
  );
};

export default AirQualityIndicator; 