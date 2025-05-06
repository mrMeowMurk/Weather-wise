import React, { useEffect, useState } from 'react';
import './Welcome.css';

const Welcome = ({ weather }) => {
  const [greeting, setGreeting] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Доброе утро');
      setTimeOfDay('утро');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Добрый день');
      setTimeOfDay('день');
    } else if (hour >= 18 && hour < 23) {
      setGreeting('Добрый вечер');
      setTimeOfDay('вечер');
    } else {
      setGreeting('Доброй ночи');
      setTimeOfDay('ночь');
    }
  }, []);

  const getWeatherMessage = () => {
    if (!weather) return 'Добро пожаловать в WeatherWise! Узнайте актуальный прогноз погоды для вашего города.';
    
    const temp = Math.round(weather.temp);
    const description = weather.weather?.[0]?.description?.toLowerCase() || '';
    let message = `Сейчас ${temp}°C. `;

    // Основное сообщение о погоде
    if (description.includes('дождь')) {
      message += 'На улице идёт дождь. Не забудьте взять с собой зонт! ';
    } else if (description.includes('снег')) {
      message += 'Идёт снег. Оденьтесь потеплее и будьте осторожны на дорогах. ';
    } else if (description.includes('облач')) {
      message += 'Облачная погода - отличное время для прогулки. ';
    } else if (description.includes('ясно')) {
      message += 'Ясная погода радует глаз. ';
    }

    // Дополнительные рекомендации
    if (temp > 25) {
      message += 'Жаркий ${timeOfDay}, не забудьте про головной убор и воду. ';
    } else if (temp < 0) {
      message += 'Морозный ${timeOfDay}, утепляйтесь как следует! ';
    } else if (temp >= 15 && temp <= 25) {
      message += 'Отличная погода для активного отдыха! ';
    }

    // Общее пожелание
    message += 'Хорошего вам дня!';
    
    return message;
  };

  return (
    <div className="welcome-container">
      <h1 className="welcome-greeting">{greeting}</h1>
      <p className="welcome-subtitle">{getWeatherMessage()}</p>
      {weather && (
        <p className="welcome-details">
          Ощущается как {Math.round(weather.apparent_temperature)}°C. 
          {weather.humidity && ` Влажность воздуха ${weather.humidity}%.`}
        </p>
      )}
    </div>
  );
};

export default Welcome; 