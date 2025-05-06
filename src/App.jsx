import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
import WeatherStats from './components/WeatherStats';
import TemperatureChart from './components/TemperatureChart';
import AirQualityIndicator from './components/AirQualityIndicator';
import Welcome from './components/Welcome';
import { MdSearch, MdMyLocation, MdNotifications } from 'react-icons/md';
import { 
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightCloudy,
  WiCloud,
  WiCloudy,
  WiRain,
  WiDayRain,
  WiNightRain,
  WiThunderstorm,
  WiSnow,
  WiFog
} from 'react-icons/wi';
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

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
            'precipitation_probability_max',
            'precipitation_sum',
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
        sunrise: new Date(weatherResponse.data.daily.sunrise[0]).getTime(),
        sunset: new Date(weatherResponse.data.daily.sunset[0]).getTime()
      };

      const dailyForecast = weatherResponse.data.daily.time.map((time, index) => ({
        temp: weatherResponse.data.daily.temperature_2m_max[index],
        temp_min: weatherResponse.data.daily.temperature_2m_min[index],
        humidity: weatherResponse.data.daily.relative_humidity_2m_max[index],
        wind_speed: weatherResponse.data.daily.wind_speed_10m_max[index],
        pop: weatherResponse.data.daily.precipitation_probability_max[index] / 100,
        rain: weatherResponse.data.daily.precipitation_sum[index],
        weather: [{
          id: weatherResponse.data.daily.weather_code[index],
          description: getWeatherDescription(weatherResponse.data.daily.weather_code[index])
        }],
        dt: new Date(time).getTime() / 1000
      })).slice(1, 6); // Берем следующие 5 дней, исключая текущий

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

  // Функция для проверки экстремальных погодных условий
  const checkWeatherConditions = (weatherData) => {
    const newNotifications = [];
    
    if (weatherData.temp >= 30) {
      newNotifications.push({
        type: 'warning',
        message: 'Высокая температура! Не забудьте про головной убор и воду.'
      });
    }
    
    if (weatherData.temp <= 0) {
      newNotifications.push({
        type: 'warning',
        message: 'Температура ниже нуля! Оденьтесь теплее.'
      });
    }
    
    if (weatherData.wind_speed >= 15) {
      newNotifications.push({
        type: 'warning',
        message: 'Сильный ветер! Будьте осторожны на улице.'
      });
    }

    setNotifications(newNotifications);
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  useEffect(() => {
    if (weather) {
      checkWeatherConditions(weather);
    }
  }, [weather]);

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

  const getWeatherIcon = (code) => {
    const icons = {
      0: <WiDaySunny className="forecast-weather-icon" />,
      1: <WiDayCloudy className="forecast-weather-icon" />,
      2: <WiCloud className="forecast-weather-icon" />,
      3: <WiCloudy className="forecast-weather-icon" />,
      45: <WiFog className="forecast-weather-icon" />,
      48: <WiFog className="forecast-weather-icon" />,
      51: <WiDayRain className="forecast-weather-icon" />,
      53: <WiDayRain className="forecast-weather-icon" />,
      55: <WiRain className="forecast-weather-icon" />,
      61: <WiDayRain className="forecast-weather-icon" />,
      63: <WiRain className="forecast-weather-icon" />,
      65: <WiRain className="forecast-weather-icon" />,
      71: <WiSnow className="forecast-weather-icon" />,
      73: <WiSnow className="forecast-weather-icon" />,
      75: <WiSnow className="forecast-weather-icon" />,
      77: <WiSnow className="forecast-weather-icon" />,
      80: <WiRain className="forecast-weather-icon" />,
      81: <WiRain className="forecast-weather-icon" />,
      82: <WiRain className="forecast-weather-icon" />,
      85: <WiSnow className="forecast-weather-icon" />,
      86: <WiSnow className="forecast-weather-icon" />,
      95: <WiThunderstorm className="forecast-weather-icon" />,
      96: <WiThunderstorm className="forecast-weather-icon" />,
      99: <WiThunderstorm className="forecast-weather-icon" />
    };
    return icons[code] || <WiDaySunny className="forecast-weather-icon" />;
  };

  return (
    <div className="weather-container">
      <header className="header">
        <h1 className="logo">WeatherWise</h1>
        <button
          className="notification-button"
          onClick={() => setShowNotifications(!showNotifications)}
          title="Уведомления о погоде"
        >
          <MdNotifications className="w-6 h-6 text-white" />
          {notifications.length > 0 && (
            <span className="notification-badge">{notifications.length}</span>
          )}
        </button>
      </header>

      {weather && <Welcome weather={weather} />}

      {showNotifications && notifications.length > 0 && (
        <div className="notifications-panel animate-fade-in mb-6">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className={`notification-item ${notification.type}`}
            >
              {notification.message}
            </div>
          ))}
        </div>
      )}

      <div className="search-section">
        <form onSubmit={handleSubmit} className="search-bar">
          <div className="search-input-container">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="search-input"
              placeholder="Введите название города..."
              list="recent-searches"
            />
            <MdSearch className="search-icon" />
            <datalist id="recent-searches">
              {recentSearches.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </div>
          <button
            type="button"
            onClick={getCurrentLocation}
            className="button"
            title="Определить местоположение"
          >
            <MdMyLocation className="w-5 h-5" />
            <span className="hidden md:inline">Моё местоположение</span>
          </button>
          <button
            type="submit"
            className="button"
            disabled={loading}
          >
            <MdSearch className="w-5 h-5" />
            <span>{loading ? 'Загрузка...' : 'Найти'}</span>
          </button>
        </form>

        {recentSearches.length > 0 && (
          <div className="recent-searches mt-4">
            <span className="text--600">Недавние поиски:</span>
            {recentSearches.map((city) => (
              <button
                key={city}
                onClick={() => {
                  setCity(city);
                  fetchWeather(null, null, city);
                }}
                className="recent-search-item"
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="error-message animate-fade-in">
          {error}
        </div>
      )}
      
      {weather && (
        <div className="weather-content animate-fade-in">
          <WeatherCard data={weather} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeatherStats data={weather} />
            <AirQualityIndicator
              pressure={weather.pressure}
              humidity={weather.humidity}
            />
          </div>

          <TemperatureChart data={[weather, ...forecast]} />
          
          <div className="forecast-section">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Прогноз на 5 дней
            </h2>
            <div className="forecast-container">
              {forecast.map((day, index) => {
                const date = new Date(day.dt * 1000);
                const formattedDate = new Intl.DateTimeFormat('ru-RU', {
                  day: 'numeric',
                  month: 'long'
                }).format(date);
                
                return (
                  <div key={index} className="forecast-card">
                    <div className="forecast-date">
                      <span className="forecast-date-weekday">
                        {new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }).format(date)}
                      </span>
                      <span className="forecast-date-full">{formattedDate}</span>
                    </div>

                    <div className="forecast-weather-icon">
                      {getWeatherIcon(day.weather[0].id)}
                    </div>

                    <div className="forecast-description">
                      {day.weather[0].description}
                    </div>

                    <div className="forecast-temps">
                      <span className="forecast-temp-max">
                        {Math.round(day.temp)}°
                      </span>
                      <span className="forecast-temp-min">
                        {Math.round(day.temp_min)}°
                      </span>
                    </div>

                    <div className="forecast-details">
                      <div className="forecast-detail-item">
                        <span className="forecast-detail-label">Влажность</span>
                        <span className="forecast-detail-value">{day.humidity}%</span>
                      </div>
                      <div className="forecast-detail-item">
                        <span className="forecast-detail-label">Ветер</span>
                        <span className="forecast-detail-value">{Math.round(day.wind_speed)} м/с</span>
                      </div>
                      <div className="forecast-detail-item">
                        <span className="forecast-detail-label">Вероятность</span>
                        <span className="forecast-detail-value">
                          {Math.round((day.pop || 0) * 100)}%
                        </span>
                      </div>
                      <div className="forecast-detail-item">
                        <span className="forecast-detail-label">Осадки</span>
                        <span className="forecast-detail-value">
                          {day.rain ? `${day.rain} мм` : '0 мм'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 