import React, { useState } from 'react';
import CitySearch from './CitySearch';
import Calendar from './Calendar';
import { toast } from 'react-toastify';
import { DayEvent, ExcelRow, GroupedEvent } from '../types/excel';

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
  onEventsLoad?: (events: DayEvent[]) => void;
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
  onLocationChange,
  onEventsLoad
}: Props) {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<DayEvent[] | null>(null);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Sending file to backend...');
      const response = await fetch('http://localhost:4000/api/events', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      console.log('Received data from backend:', data);

      if (response.ok) {
        setEvents(data);
      } else {
        console.error('Error uploading file:', data.error);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="flex">
      <div className="bg-navy-blue p-4 text-white w-68 print:hidden">
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

          <div>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="excel-upload"
            />
            <button
              onClick={() => document.getElementById('excel-upload')?.click()}
              className={`w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Ladataan...' : 'Lisää tapahtumat'}
            </button>
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
            events={events || []}
          />
        </div>
      )}
    </div>
  );
}