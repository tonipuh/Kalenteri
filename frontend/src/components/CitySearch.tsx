import React, { useState, useEffect } from 'react';
import { City } from '../types';

type Props = {
  onCitySelect: (city: City) => void;
  selectedCity?: City;
};

export default function CitySearch({ onCitySelect, selectedCity }: Props) {
  const [searchTerm, setSearchTerm] = useState(selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : '');
  const [cities, setCities] = useState<City[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  useEffect(() => {
    if (searchTerm.length >= 3) {
      fetch(`/api/cities?search=${searchTerm}`)
        .then(res => res.json())
        .then(data => {
          setCities(data);
          setSelectedIndex(-1);
        });
    } else {
      setCities([]);
      setSelectedIndex(-1);
    }
  }, [searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => Math.min(prev + 1, cities.length - 1));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleCitySelect(cities[selectedIndex]);
    }
  };

  const handleCitySelect = (city: City) => {
    if (onCitySelect) {
      onCitySelect(city);
      setSearchTerm(`${city.name}, ${city.country}`);
      setCities([]);
    }
  };

  return (
    <div className="relative w-64">
      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search city..."
        className="w-full p-2 border rounded text-gray-800 bg-white"
      />
      {cities.length > 0 && (
        <div className="absolute w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto z-10">
          {cities.map((city, index) => (
            <div
              key={`${city.name}-${city.country}-${city.latitude}-${city.longitude}`}
              onClick={() => handleCitySelect(city)}
              className={`p-2 cursor-pointer text-gray-800
                ${index === selectedIndex ? 'bg-blue-100' : 'bg-white hover:bg-gray-50'}`}
            >
              {city.name}, {city.country}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}