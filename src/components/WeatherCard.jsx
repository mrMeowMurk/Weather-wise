import React from 'react';
import { WiSunrise, WiSunset, WiThermometer, WiHumidity, WiStrongWind, WiBarometer } from 'react-icons/wi';

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
    <div className="weather-card backdrop-blur-md bg-gradient-to-br from-white/90 to-white/70 overflow-hidden">
      <div className="relative">
        {/* Декоративный элемент */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-300/20 rounded-full blur-2xl transform translate-x-16 -translate-y-8"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {/* Левая секция с основной информацией */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white-800">Сейчас</h2>
              <p className="text-sm text-white-600">{new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="weather-icon-container relative">
                <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-xl"></div>
                <div className="relative">
                  {/* Здесь можно добавить иконку погоды */}
                </div>
              </div>
              <div>
                <div className="flex items-start">
                  <span className="text-6xl font-bold text-white-800 tracking-tighter">
                    {Math.round(data.temp)}
                  </span>
                  <span className="text-4xl font-bold text-white-400 mt-1">°C</span>
                </div>
                <p className="text-lg text-white-600 mt-1 capitalize">
                  {data.weather[0].description}
                </p>
              </div>
            </div>
          </div>

          {/* Правая секция с дополнительной информацией */}
          <div className="space-y-6">
            {/* Восход и закат */}
            <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <WiSunrise className="text-3xl text-amber-500" />
                <div>
                  <p className="text-sm text-gray-500">Восход</p>
                  <p className="font-semibold text-gray-800">{formatTime(data.sunrise)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <WiSunset className="text-3xl text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Закат</p>
                  <p className="font-semibold text-gray-800">{formatTime(data.sunset)}</p>
                </div>
              </div>
            </div>

            {/* Сетка с метриками */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-xl backdrop-blur-sm transition-all hover:bg-white/70">
                <WiThermometer className="text-3xl text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Ощущается как</p>
                  <p className="font-semibold text-gray-800">{Math.round(data.apparent_temperature)}°C</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-xl backdrop-blur-sm transition-all hover:bg-white/70">
                <WiHumidity className="text-3xl text-teal-500" />
                <div>
                  <p className="text-sm text-gray-500">Влажность</p>
                  <p className="font-semibold text-gray-800">{data.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-xl backdrop-blur-sm transition-all hover:bg-white/70">
                <WiStrongWind className="text-3xl text-cyan-500" />
                <div>
                  <p className="text-sm text-gray-500">Ветер</p>
                  <p className="font-semibold text-gray-800">{Math.round(data.wind_speed)} м/с</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-xl backdrop-blur-sm transition-all hover:bg-white/70">
                <WiBarometer className="text-3xl text-indigo-500" />
                <div>
                  <p className="text-sm text-gray-500">Давление</p>
                  <p className="font-semibold text-gray-800">{Math.round(data.pressure)} гПа</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard; 