import React, { useState } from 'react';
import Calendar from './components/Calendar';
import CommandPanel from './components/CommandPanel';
import { GeolocationCoordinates } from './types';

const App: React.FC = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Lasketaan loppupäivä (3kk eteenpäin)
  let endMonth = currentMonth + 3;
  let endYear = currentYear;

  // Jos mennään yli vuoden vaihteen
  if (endMonth > 12) {
    endMonth = endMonth - 12;
    endYear = currentYear + 1;
  }

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [endMonthState, setEndMonth] = useState(endMonth);
  const [endYearState, setEndYear] = useState(endYear);
  const [location, setLocation] = useState<GeolocationCoordinates>({
    latitude: 60.1699,
    longitude: 24.9384
  });

  const handleLocationChange = (coords: GeolocationCoordinates) => {
    console.log('Location changed:', coords);
    setLocation(coords);
  };

  return (
    <div className="min-h-screen p-4">
      <CommandPanel
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        endMonth={endMonthState}
        endYear={endYearState}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
        onEndMonthChange={setEndMonth}
        onEndYearChange={setEndYear}
        onLocationChange={handleLocationChange}
      />
      <Calendar
        month={selectedMonth}
        year={selectedYear}
        endMonth={endMonthState}
        endYear={endYearState}
        location={location}
      />
    </div>
  );
};

export default App;