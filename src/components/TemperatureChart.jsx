import React, { useEffect, useRef } from 'react';

const TemperatureChart = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Устанавливаем размеры canvas с учетом pixel ratio
    const pixelRatio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * pixelRatio;
    canvas.height = rect.height * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);

    // Очистка canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Находим min и max значения температуры
    const temperatures = data.map(item => item.temp);
    const minTemp = Math.min(...temperatures) - 2;
    const maxTemp = Math.max(...temperatures) + 2;
    const tempRange = maxTemp - minTemp;

    // Отступы для графика
    const padding = {
      top: 40,
      right: 30,
      bottom: 60,
      left: 40
    };

    // Размеры области графика
    const chartWidth = rect.width - padding.left - padding.right;
    const chartHeight = rect.height - padding.top - padding.bottom;

    // Функции для преобразования координат
    const getX = (index) => padding.left + (chartWidth / (data.length - 1)) * index;
    const getY = (temp) => padding.top + chartHeight - ((temp - minTemp) / tempRange) * chartHeight;

    // Рисуем сетку и подписи
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.setLineDash([5, 5]);

    // Горизонтальные линии
    for (let temp = Math.floor(minTemp); temp <= Math.ceil(maxTemp); temp += 2) {
      const y = getY(temp);
      ctx.moveTo(padding.left, y);
      ctx.lineTo(rect.width - padding.right, y);
      
      // Подписи температуры
      ctx.fillStyle = '#718096';
      ctx.font = '12px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(`${temp}°`, padding.left - 10, y + 4);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Рисуем график
    ctx.beginPath();
    ctx.strokeStyle = '#0083B0';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Создаем градиент для заливки
    const gradient = ctx.createLinearGradient(0, padding.top, 0, rect.height - padding.bottom);
    gradient.addColorStop(0, 'rgba(0, 131, 176, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 131, 176, 0)');

    // Рисуем линию и точки
    data.forEach((item, index) => {
      const x = getX(index);
      const y = getY(item.temp);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Рисуем точки
      ctx.fillStyle = '#0083B0';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Подписи дат
      ctx.fillStyle = '#4A5568';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      const date = new Date(item.dt * 1000);
      ctx.fillText(
        date.toLocaleDateString('ru-RU', { weekday: 'short' }),
        x,
        rect.height - padding.bottom + 20
      );
      ctx.fillText(
        date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
        x,
        rect.height - padding.bottom + 40
      );

      // Подписи температуры над точками
      ctx.fillStyle = '#2D3748';
      ctx.font = 'bold 14px Inter';
      ctx.fillText(`${Math.round(item.temp)}°`, x, y - 15);
    });

    // Заливка под графиком
    ctx.lineTo(getX(data.length - 1), rect.height - padding.bottom);
    ctx.lineTo(padding.left, rect.height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Рисуем линию графика поверх заливки
    ctx.beginPath();
    data.forEach((item, index) => {
      const x = getX(index);
      const y = getY(item.temp);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = '#0083B0';
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [data]);

  return (
    <div className="temperature-chart-container">
      <h3 className="text-xl font-semibold mb-4">График температуры</h3>
      <div className="temperature-chart">
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default TemperatureChart; 