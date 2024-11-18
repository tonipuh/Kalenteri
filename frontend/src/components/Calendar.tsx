import React, { useState, useEffect } from 'react';
import { GeolocationCoordinates } from '../types';

interface CalendarProps {
  month: number;
  year: number;
  endMonth: number;
  endYear: number;
  location: GeolocationCoordinates;
}

const isDSTChange = (date: Date) => {
  const prevDay = new Date(date);
  prevDay.setDate(date.getDate() - 1);
  return prevDay.getTimezoneOffset() !== date.getTimezoneOffset();
};

const Calendar: React.FC<CalendarProps> = ({ month, year, endMonth, endYear, location }) => {
  const [sunlightData, setSunlightData] = useState<Map<string, any>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const getMonthsToShow = () => {
    const months = [];
    let currentDate = new Date(year, month - 1);
    const endDate = new Date(endYear, endMonth - 1);

    while (currentDate <= endDate) {
      months.push({
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return months;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      const newData = new Map();

      for (const { month: m, year: y } of getMonthsToShow()) {
        const daysInMonth = new Date(y, m, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(y, m - 1, day);
          const dateStr = date.toISOString().split('T')[0];

          try {
            const response = await fetch(
              `/api/sunlight?` +
              `lat=${location?.latitude || 60.1699}&` +
              `lon=${location?.longitude || 24.9384}&` +
              `date=${dateStr}`
            );

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            newData.set(dateStr, data);
          } catch (error) {
            console.error(`Error fetching data for ${dateStr}:`, error);
          }
        }
      }

      setSunlightData(newData);
      setIsLoading(false);
    };

    fetchAllData();
  }, [location, month, year, endMonth, endYear]);

  const isNightTime = (hour: number, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const times = sunlightData.get(dateStr);

    if (!times) {
      return 'day';
    }

    const currentTime = new Date(dateStr);
    currentTime.setHours(hour, 0, 0, 0);

    const dawn = new Date(times.dawn);
    const dusk = new Date(times.dusk);
    const sunrise = new Date(times.sunrise);
    const sunset = new Date(times.sunset);

    if (currentTime < dawn || currentTime > dusk) {
      return 'night';
    } else if (currentTime < sunrise || currentTime > sunset) {
      return 'twilight';
    }
    return 'day';
  };

  return (
    <div className="p-4 space-y-8">
      {isLoading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Ladataan auringon aikoja...</p>
        </div>
      ) : (
        getMonthsToShow().map(({ month: m, year: y }) => (
          <div key={`${m}-${y}`}>
            <h2 className="text-xl font-bold mb-4">
              {new Intl.DateTimeFormat('fi-FI', { month: 'long', year: 'numeric' }).format(new Date(y, m - 1))}
            </h2>
            <table className="w-full border-collapse mb-8">
              <thead>
                <tr>
                  <th className="px-2">Pvm</th>
                  <th className="px-2">Vkp</th>
                  {Array.from({ length: 24 }, (_, i) => (
                    <th key={i} className="w-8">{i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: new Date(y, m, 0).getDate() }, (_, i) => {
                  const day = new Date(y, m - 1, i + 1);
                  const isSunday = day.getDay() === 0;
                  const isDST = isDSTChange(day);

                  return (
                    <tr key={i} className={isDST ? "border-b-2 border-yellow-400" : ""}>
                      <td className={`px-2 text-center border border-gray-200 ${isSunday ? "text-red-600" : ""}`}>
                        {i + 1}
                      </td>
                      <td className={`px-2 text-center border border-gray-200 ${isSunday ? "text-red-600" : ""}`}>
                        {new Intl.DateTimeFormat('fi-FI', { weekday: 'short' }).format(day)}
                      </td>
                      {Array.from({ length: 24 }, (_, hour) => {
                        const timeStatus = isNightTime(hour, day);
                        let bgColor;

                        if (timeStatus === 'night') {
                          bgColor = isSunday ? 'bg-gray-200' : 'bg-gray-300';
                        } else if (timeStatus === 'twilight') {
                          bgColor = isSunday ? 'bg-gray-100' : 'bg-gray-200';
                        } else {
                          bgColor = isSunday ? 'bg-red-50' : 'bg-white';
                        }

                        return (
                          <td
                            key={hour}
                            className={`w-8 h-8 border border-gray-100 ${bgColor}`}
                          />
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default Calendar;