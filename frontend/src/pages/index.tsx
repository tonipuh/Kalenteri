import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import CommandPanel from '../components/CommandPanel';

export default function Home() {
  const [dateRange, setDateRange] = useState({
    start: { month: new Date().getMonth(), year: new Date().getFullYear() },
    end: {
      month: new Date().getMonth() + 3,
      year: new Date().getFullYear()
    }
  });
  const [location, setLocation] = useState({
    latitude: 60.1699,
    longitude: 24.9384
  });

  const handleDateRangeChange = (
    start: { month: number; year: number },
    end: { month: number; year: number }
  ) => {
    console.log('Date range changed:', { start, end });
    setDateRange({ start, end });
  };

  const handleLocationChange = (newLocation: { latitude: number; longitude: number }) => {
    console.log('Location changed:', newLocation);
    setLocation(newLocation);
  };

  return (
    <div className="min-h-screen flex">
      <CommandPanel
        onDateRangeChange={handleDateRangeChange}
        onLocationChange={handleLocationChange}
      />
      <div className="flex-1 p-4">
        <Calendar
          month={dateRange.start.month}
          year={dateRange.start.year}
          endMonth={dateRange.end.month}
          endYear={dateRange.end.year}
          location={location}
        />
      </div>
    </div>
  );
}