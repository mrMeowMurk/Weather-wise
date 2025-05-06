import React from 'react';
import { 
  WiHumidity, 
  WiStrongWind,
  WiBarometer,
  WiSunrise, 
  WiSunset,
  WiThermometer,
  WiWindDeg,
  WiRaindrop,
  WiUmbrella,
  WiDust
} from 'react-icons/wi';
import { TbCompass, TbUvIndex } from 'react-icons/tb';
import { MdVisibility } from 'react-icons/md';

const WeatherStats = ({ data }) => {
  // Функция для получения текстового описания направления ветра
  const getWindDirection = (degrees) => {
    const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  // Функция для форматирования времени
  const formatTime = (timestamp) => {
    if (!timestamp) return '--:--';
    return new Date(timestamp * 1000).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp * 1000).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    });
  };

  // Функция для определения комфортности температуры
  const getComfortLevel = (temp) => {
    if (temp <= 0) return 'Холодно';
    if (temp <= 10) return 'Прохладно';
    if (temp <= 20) return 'Комфортно';
    if (temp <= 30) return 'Тепло';
    return 'Жарко';
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {/* Ветер */}
      <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <WiStrongWind className="text-blue-500 text-2xl" />
          <span className="text-white-700">Ветер</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline">
            <span className="text-3xl font-medium">{Math.round(data.wind_speed)}</span>
            <span className="text-white-500 ml-1">м/с</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white-500">
            <TbCompass />
            <span>Направление: {data.wind_direction}° ({getWindDirection(data.wind_direction)})</span>
          </div>
          {data.wind_gust && (
            <div className="flex items-center gap-2 text-sm text-white-500">
              <WiWindDeg />
              <span>Порывы до {Math.round(data.wind_gust)} м/с</span>
            </div>
          )}
        </div>
      </div>

      {/* Влажность */}
      <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <WiHumidity className="text-teal-500 text-2xl" />
          <span className="text-white-700">Влажность</span>
          <span className="ml-auto text-3xl font-medium">{data.humidity}%</span>
        </div>
        <div className="flex flex-col gap-2 text-sm text-white-500">
          <div className="flex items-center gap-2">
            <WiThermometer />
            <span>Ощущается как {Math.round(data.apparent_temperature)}°</span>
          </div>
          <div className="flex items-center gap-2">
            <WiRaindrop />
            <span>Точка росы: {Math.round(data.dew_point || 0)}°</span>
          </div>
          <div>
            Комфортность: {getComfortLevel(data.temp)}
          </div>
        </div>
      </div>

      {/* Давление */}
      <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <WiBarometer className="text-purple-500 text-2xl" />
          <span className="text-white-700">Давление</span>
          <span className="ml-auto text-3xl font-medium">{Math.round(data.pressure)}</span>
        </div>
        <div className="flex flex-col gap-2 text-sm text-white-500">
          <div>
            {Math.round(data.pressure * 0.75006375541921)} мм рт.ст.
          </div>
          <div>
            Тенденция: {data.pressure > 1013 ? 'Высокое' : data.pressure < 1013 ? 'Низкое' : 'Нормальное'}
          </div>
          {data.pressure_trend && (
            <div className="flex items-center gap-1">
              <span>Изменение:</span>
              <span className={data.pressure_trend > 0 ? 'text-green-500' : 'text-red-500'}>
                {data.pressure_trend > 0 ? '↑' : '↓'} {Math.abs(data.pressure_trend)} мм/ч
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Дополнительные метрики */}
      <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TbUvIndex className="text-yellow-500 text-2xl" />
          <span className="text-white-700">УФ индекс</span>
          <span className="ml-auto text-3xl font-medium">{Math.round(data.uv_index || 0)}</span>
        </div>
        <div className="flex flex-col gap-2 text-sm text-white-500">
          <div className="flex items-center gap-2">
            <MdVisibility />
            <span>Видимость: {Math.round((data.visibility || 0) / 1000)} км</span>
          </div>
          <div className="flex items-center gap-2">
            <WiDust />
            <span>Облачность: {data.clouds || 0}%</span>
          </div>
        </div>
      </div>

      {/* Осадки */}
      <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <WiUmbrella className="text-blue-500 text-2xl" />
          <span className="text-white-700">Осадки</span>
        </div>
        <div className="flex flex-col gap-2 text-sm text-white-500">
          <div>
            За последний час: {data.precipitation_1h || 0} мм
          </div>
          <div>
            За 24 часа: {data.precipitation_24h || 0} мм
          </div>
          <div>
            Вероятность: {data.precipitation_probability || 0}%
          </div>
        </div>
      </div>

      {/* Восход и закат */}
      <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-5 col-span-2 lg:col-span-1">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <WiSunrise className="text-amber-500 text-3xl" />
            <div>
              <div className="text-2xl font-medium">{formatTime(data.sunrise)}</div>
              <div className="text-sm text-white-500">{formatDate(data.sunrise)}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <WiSunset className="text-orange-500 text-3xl" />
            <div>
              <div className="text-2xl font-medium">{formatTime(data.sunset)}</div>
              <div className="text-sm text-white-500">{formatDate(data.sunset)}</div>
            </div>
          </div>
          <div className="text-sm text-white-500">
            Продолжительность дня: {Math.round((data.sunset - data.sunrise) / 3600)} ч
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherStats; 