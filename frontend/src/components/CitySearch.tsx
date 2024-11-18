import React, { useState } from 'react';
import { City } from '../types/types';

interface CitySearchProps {
  onCitySelect: (location: { latitude: number; longitude: number }) => void;
}

const CitySearch: React.FC<CitySearchProps> = ({ onCitySelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (searchTerm.trim() === '') return;
    setIsLoading(true);
    try {
      const encodedSearchTerm = encodeURIComponent(searchTerm.trim());
      console.log('Searching for:', encodedSearchTerm);

      const response = await fetch(`http://localhost:4000/api/cities?search=${encodedSearchTerm}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: City[] = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelect = (city: City) => {
    setSearchTerm(`${city.name}, ${city.country}`);
    setCities([]);
    onCitySelect({
      latitude: city.lat,
      longitude: city.lon
    });
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          placeholder="Search for a city"
          className="p-2 border rounded bg-white text-gray-900 flex-grow"
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={isLoading || searchTerm.trim() === ''}
        >
          {isLoading ? 'Loading...' : 'Search'}
        </button>
      </div>
      {cities.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
          {cities.map((city) => (
            <li
              key={`${city.name}-${city.lat}-${city.lon}`}
              onClick={() => handleCitySelect(city)}
              className="p-2 hover:bg-gray-100 cursor-pointer text-gray-900"
            >
              {city.name}, {city.country} {city.population > 0 && `(${city.population.toLocaleString()})`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CitySearch;