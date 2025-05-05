import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
import WeatherStats from './components/WeatherStats';
import { MdSearch, MdMyLocation } from 'react-icons/md';
import './App.css';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

function App() {
  const [city, setCity] = useState('Москва');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchWeather = async (lat, lon, cityName) => {
    try {
      setLoading(true);
      setError(null);

      let latitude = lat;
      let longitude = lon;

      if (!latitude || !longitude) {
        // Получаем координаты города
        const geoResponse = await axios.get(GEOCODING_URL, {
          params: {
            name: cityName || city,
            count: 1,
            language: 'ru'
          }
        });

        if (!geoResponse.data.results?.length) {
          throw new Error('Город не найден');
        }

        latitude = geoResponse.data.results[0].latitude;
        longitude = geoResponse.data.results[0].longitude;
        
        // Сохраняем в недавние поиски
        const newCity = geoResponse.data.results[0].name;
        if (!recentSearches.includes(newCity)) {
          const updatedSearches = [newCity, ...recentSearches].slice(0, 5);
          setRecentSearches(updatedSearches);
          localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
        }
      }

      // Получаем прогноз погоды
      const weatherResponse = await axios.get(WEATHER_URL, {
        params: {
          latitude,
          longitude,
          timezone: 'auto',
          current: [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'weather_code',
            'wind_speed_10m',
            'surface_pressure',
            'wind_direction_10m'
          ],
          daily: [
            'temperature_2m_max',
            'temperature_2m_min',
            'weather_code',
            'wind_speed_10m_max',
            'relative_humidity_2m_max',
            'sunrise',
            'sunset'
          ],
          forecast_days: 6
        }
      });

      const currentWeather = {
        temp: weatherResponse.data.current.temperature_2m,
        humidity: weatherResponse.data.current.relative_humidity_2m,
        wind_speed: weatherResponse.data.current.wind_speed_10m,
        apparent_temperature: weatherResponse.data.current.apparent_temperature,
        pressure: weatherResponse.data.current.surface_pressure,
        wind_direction: weatherResponse.data.current.wind_direction_10m,
        weather: [{ 
          id: weatherResponse.data.current.weather_code,
          description: getWeatherDescription(weatherResponse.data.current.weather_code)
        }],
        dt: new Date().getTime() / 1000,
        sunrise: weatherResponse.data.daily.sunrise[0],
        sunset: weatherResponse.data.daily.sunset[0]
      };

      const dailyForecast = weatherResponse.data.daily.time.slice(1).map((time, index) => ({
        temp: weatherResponse.data.daily.temperature_2m_max[index + 1],
        temp_min: weatherResponse.data.daily.temperature_2m_min[index + 1],
        humidity: weatherResponse.data.daily.relative_humidity_2m_max[index + 1],
        wind_speed: weatherResponse.data.daily.wind_speed_10m_max[index + 1],
        weather: [{
          id: weatherResponse.data.daily.weather_code[index + 1],
          description: getWeatherDescription(weatherResponse.data.daily.weather_code[index + 1])
        }],
        dt: new Date(time).getTime() / 1000
      }));

      setWeather(currentWeather);
      setForecast(dailyForecast);
    } catch (err) {
      setError(err.message || 'Не удалось загрузить данные о погоде. Проверьте название города.');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'Ясно',
      1: 'Преимущественно ясно',
      2: 'Переменная облачность',
      3: 'Пасмурно',
      45: 'Туман',
      48: 'Изморозь',
      51: 'Легкая морось',
      53: 'Умеренная морось',
      55: 'Сильная морось',
      61: 'Небольшой дождь',
      63: 'Умеренный дождь',
      65: 'Сильный дождь',
      71: 'Небольшой снег',
      73: 'Умеренный снег',
      75: 'Сильный снег',
      77: 'Снежные зёрна',
      80: 'Небольшой ливень',
      81: 'Умеренный ливень',
      82: 'Сильный ливень',
      85: 'Небольшой снегопад',
      86: 'Сильный снегопад',
      95: 'Гроза',
      96: 'Гроза с градом',
      99: 'Сильная гроза с градом'
    };
    return descriptions[code] || 'Неизвестно';
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setError('Не удалось получить ваше местоположение. ' + error.message);
        }
      );
    } else {
      setError('Геолокация не поддерживается вашим браузером.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          WeatherWise
        </h1>

        <div className="glass-card p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="search-input w-full px-4 py-2 rounded-lg"
                placeholder="Введите название города..."
                list="recent-searches"
              />
              <MdSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <datalist id="recent-searches">
                {recentSearches.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>
            <button
              type="button"
              onClick={getCurrentLocation}
              className="button-primary !px-3"
              title="Определить местоположение"
            >
              <MdMyLocation className="w-6 h-6" />
            </button>
            <button
              type="submit"
              className="button-primary"
              disabled={loading}
            >
              {loading ? 'Загрузка...' : 'Поиск'}
            </button>
          </form>

          {recentSearches.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Недавние поиски:
              {recentSearches.map((city, index) => (
                <button
                  key={city}
                  onClick={() => {
                    setCity(city);
                    fetchWeather(null, null, city);
                  }}
                  className="ml-2 px-2 py-1 rounded-md hover:bg-white/30 transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100/80 backdrop-blur-sm text-red-700 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {weather && (
          <div className="space-y-6">
            <WeatherCard data={weather} />
            <WeatherStats data={weather} />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">
              Прогноз на 5 дней
            </h2>
            <div className="daily-forecast">
              {forecast.map((day) => (
                <WeatherCard key={day.dt} data={day} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 