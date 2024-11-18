import React, { useEffect, useState } from 'react';
import CitySearch from './CitySearch';
import { GeolocationCoordinates } from '../types';

const months = [
  'Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu',
  'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'
];

interface CommandPanelProps {
  onDateRangeChange: (
    start: { month: number; year: number },
    end: { month: number; year: number }
  ) => void;
  onLocationChange: (location: { latitude: number; longitude: number }) => void;
}

const CommandPanel: React.FC<CommandPanelProps> = ({ onDateRangeChange, onLocationChange }) => {
  // Lasketaan dynaamiset oletusarvot
  const today = new Date();
  const defaultStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Edellinen kuukausi
  const defaultEndDate = new Date(today.getFullYear(), today.getMonth() + 2, 1); // 3kk eteenpäin

  const [startMonth, setStartMonth] = useState(defaultStartDate.getMonth() + 1);
  const [startYear, setStartYear] = useState(defaultStartDate.getFullYear());
  const [endMonth, setEndMonth] = useState(defaultEndDate.getMonth() + 1);
  const [endYear, setEndYear] = useState(defaultEndDate.getFullYear());

  // Lasketaan vuodet dynaamisesti
  const years = Array.from(
    { length: 3 },
    (_, i) => defaultStartDate.getFullYear() + i
  );

  const handleStartMonthChange = (month: number) => {
    setStartMonth(month);
    onDateRangeChange(
      { month, year: startYear },
      { month: endMonth, year: endYear }
    );
  };

  const handleStartYearChange = (year: number) => {
    setStartYear(year);
    onDateRangeChange(
      { month: startMonth, year },
      { month: endMonth, year: endYear }
    );
  };

  const handleEndMonthChange = (month: number) => {
    setEndMonth(month);
    onDateRangeChange(
      { month: startMonth, year: startYear },
      { month, year: endYear }
    );
  };

  const handleEndYearChange = (year: number) => {
    setEndYear(year);
    onDateRangeChange(
      { month: startMonth, year: startYear },
      { month: endMonth, year }
    );
  };

  const handleDateChange = () => {
    console.log('Sending date range:', {
      start: { month: startMonth, year: startYear },
      end: { month: endMonth, year: endYear }
    });

    onDateRangeChange(
      { month: startMonth, year: startYear },
      { month: endMonth, year: endYear }
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-navy text-white h-full w-1/5">
      <div>
        <h2 className="text-lg mb-2">Sijainti</h2>
        <CitySearch onCitySelect={onLocationChange} />
      </div>

      <div>
        <h2 className="text-lg mb-2">Aloituspäivä</h2>
        <div className="flex flex-col gap-2">
          <select
            value={startMonth}
            onChange={(e) => handleStartMonthChange(Number(e.target.value))}
            className="p-2 border rounded bg-white text-gray-900"
          >
            {months.map((month, index) => (
              <option key={month} value={index + 1}>{month}</option>
            ))}
          </select>

          <select
            value={startYear}
            onChange={(e) => handleStartYearChange(Number(e.target.value))}
            className="p-2 border rounded bg-white text-gray-900"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <h2 className="text-lg mb-2">Lopetuspäivä</h2>
        <div className="flex flex-col gap-2">
          <select
            value={endMonth}
            onChange={(e) => handleEndMonthChange(Number(e.target.value))}
            className="p-2 border rounded bg-white text-gray-900"
          >
            {months.map((month, index) => (
              <option key={month} value={index + 1}>{month}</option>
            ))}
          </select>

          <select
            value={endYear}
            onChange={(e) => handleEndYearChange(Number(e.target.value))}
            className="p-2 border rounded bg-white text-gray-900"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleDateChange}
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Käytä
      </button>
    </div>
  );
};

export default CommandPanel;