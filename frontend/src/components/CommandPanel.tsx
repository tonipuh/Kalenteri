import React, { useState } from 'react';
import CitySearch from './CitySearch';
import Calendar from './Calendar';

type City = {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

type Props = {
  selectedMonth: number;
  selectedYear: number;
  endMonth: number;
  endYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onEndMonthChange: (month: number) => void;
  onEndYearChange: (year: number) => void;
  onLocationChange: (location: City) => void;
};

export default function CommandPanel({
  selectedMonth,
  selectedYear,
  endMonth,
  endYear,
  onMonthChange,
  onYearChange,
  onEndMonthChange,
  onEndYearChange,
  onLocationChange
}: Props) {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
  };

  return (
    <div className="flex">
      <div className="bg-navy-blue p-4 text-white w-64 min-h-screen">
        <div className="flex flex-col space-y-6">
          <div>
            <label className="block text-sm mb-2">City:</label>
            <CitySearch
              onCitySelect={handleCitySelect}
              selectedCity={selectedCity || undefined}
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Start Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange(parseInt(e.target.value))}
              className="w-full text-black p-1"
            >
              {MONTHS.map((month, index) => (
                <option key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Start Year:</label>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => onYearChange(parseInt(e.target.value))}
              className="w-full text-black p-1"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">End Month:</label>
            <select
              value={endMonth}
              onChange={(e) => onEndMonthChange(parseInt(e.target.value))}
              className="w-full text-black p-1"
            >
              {MONTHS.map((month, index) => (
                <option key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">End Year:</label>
            <input
              type="number"
              value={endYear}
              onChange={(e) => onEndYearChange(parseInt(e.target.value))}
              className="w-full text-black p-1"
            />
          </div>
        </div>
      </div>

      {selectedCity && (
        <div className="flex-1 p-4">
          <Calendar
            location={selectedCity}
            startMonth={selectedMonth}
            startYear={selectedYear}
            endMonth={endMonth}
            endYear={endYear}
          />
        </div>
      )}
    </div>
  );
}