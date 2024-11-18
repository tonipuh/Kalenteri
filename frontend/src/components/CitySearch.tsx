import React, { useState, useEffect } from 'react';
import { GeolocationCoordinates } from '../types';

interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
  population: number;
}

interface CitySearchProps {
  onCitySelect: (coords: GeolocationCoordinates) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const CitySearch: React.FC<CitySearchProps> = ({ onCitySelect }) => {
  console.log('CitySearch rendered, onCitySelect:', typeof onCitySelect); // Debug

  const [searchTerm, setSearchTerm] = useState('Helsinki, Finland');
  const [cities, setCities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchCities = async () => {
      if (searchTerm.length < 2) {
        setCities([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/cities?search=${searchTerm}`);
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error('Error searching cities:', error);
      }
      setIsLoading(false);
    };

    const timeoutId = setTimeout(searchCities, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleCitySelect = (city: any) => {
    console.log('Selected city:', city); // Debug
    setSearchTerm(`${city.name}, ${city.country}`);
    setCities([]); // Suljetaan lista
    onCitySelect({
      latitude: city.lat,
      longitude: city.lon
    });
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Hae kaupunkia..."
        className="w-full p-2 rounded bg-white text-gray-900 border border-gray-300"
      />

      {cities.length > 0 && (
        <ul className="absolute w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-auto z-50 shadow-lg">
          {cities.map((city) => (
            <li
              key={`${city.name}-${city.country}`}
              onClick={() => {
                console.log('City clicked:', city); // Debug
                handleCitySelect(city);
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-900">{city.name}</span>
                  <span className="text-gray-600 ml-2">{city.country}</span>
                </div>
                {city.population && (
                  <span className="text-sm text-gray-500">
                    {new Intl.NumberFormat('fi-FI').format(city.population)}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CitySearch;