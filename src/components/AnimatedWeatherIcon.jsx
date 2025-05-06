import React from 'react';
import { WiDaySunny } from '@react-icons/all-files/wi/WiDaySunny';
import { WiNightClear } from '@react-icons/all-files/wi/WiNightClear';
import { WiDayCloudy } from '@react-icons/all-files/wi/WiDayCloudy';
import { WiNightCloudy } from '@react-icons/all-files/wi/WiNightCloudy';
import { WiCloud } from '@react-icons/all-files/wi/WiCloud';
import { WiCloudy } from '@react-icons/all-files/wi/WiCloudy';
import { WiFog } from '@react-icons/all-files/wi/WiFog';
import { WiShowers } from '@react-icons/all-files/wi/WiShowers';
import { WiRain } from '@react-icons/all-files/wi/WiRain';
import { WiSnow } from '@react-icons/all-files/wi/WiSnow';
import { WiStormShowers } from '@react-icons/all-files/wi/WiStormShowers';
import { WiDayThunderstorm } from '@react-icons/all-files/wi/WiDayThunderstorm';

const AnimatedWeatherIcon = ({ code, isDay, className = "w-16 h-16" }) => {
  const getIcon = () => {
    switch (code) {
      case 0: // Ясно
        return isDay ? <WiDaySunny className="text-yellow-500 animate-pulse" /> : <WiNightClear className="text-gray-300" />;
      case 1: // Преимущественно ясно
        return isDay ? <WiDayCloudy className="text-yellow-400" /> : <WiNightCloudy className="text-gray-400" />;
      case 2: // Переменная облачность
        return <WiCloud className="text-gray-400 animate-bob" />;
      case 3: // Пасмурно
        return <WiCloudy className="text-gray-500" />;
      case 45: // Туман
      case 48: // Изморозь
        return <WiFog className="text-gray-400 animate-pulse" />;
      case 51: // Легкая морось
      case 53: // Умеренная морось
      case 55: // Сильная морось
        return <WiShowers className="text-blue-400 animate-drizzle" />;
      case 61: // Небольшой дождь
      case 63: // Умеренный дождь
      case 65: // Сильный дождь
        return <WiRain className="text-blue-500 animate-rain" />;
      case 71: // Небольшой снег
      case 73: // Умеренный снег
      case 75: // Сильный снег
      case 77: // Снежные зёрна
        return <WiSnow className="text-blue-200 animate-snow" />;
      case 80: // Небольшой ливень
      case 81: // Умеренный ливень
      case 82: // Сильный ливень
        return <WiStormShowers className="text-blue-600 animate-rain" />;
      case 95: // Гроза
      case 96: // Гроза с градом
      case 99: // Сильная гроза с градом
        return <WiDayThunderstorm className="text-yellow-600 animate-flash" />;
      default:
        return <WiDaySunny className="text-yellow-500" />;
    }
  };

  return (
    <div className={`${className} transition-transform duration-300 hover:scale-110`}>
      {getIcon()}
    </div>
  );
};

export default AnimatedWeatherIcon; 