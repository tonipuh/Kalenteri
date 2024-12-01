import React, { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import CommandPanel from '../components/CommandPanel';
import { GeolocationCoordinates, City } from '../types';
import CitySearch from '../components/CitySearch';

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [endMonthState, setEndMonth] = useState(selectedMonth);
  const [endYearState, setEndYear] = useState(selectedYear);
  const [location, setLocation] = useState<City | null>(null);

  const handleCitySelect = (city: City) => {
    console.log('Index - Raw city data:', city);

    if (!city.latitude || !city.longitude) {
      console.error('Invalid coordinates:', city);
      return;
    }

    setLocation({
      latitude: city.latitude,
      longitude: city.longitude,
      timezone: city.timezone
    });
  };

  return (
    <div className="flex h-screen">
      <CommandPanel
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        endMonth={endMonthState}
        endYear={endYearState}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
        onEndMonthChange={setEndMonth}
        onEndYearChange={setEndYear}
        onLocationChange={setLocation}
      />
      <div className="ml-64 flex-1 p-4 overflow-auto h-screen">
        {location && (
          <Calendar
            location={location}
            startMonth={selectedMonth}
            startYear={selectedYear}
            endMonth={endMonthState}
            endYear={endYearState}
          />
        )}
      </div>
    </div>
  );
}