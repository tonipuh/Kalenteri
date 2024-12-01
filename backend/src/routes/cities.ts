import express from 'express';
import cities from 'all-the-cities';
import { find } from 'geo-tz';

const router = express.Router();

type CityData = {
  name: string;
  country: string;
  cityId: number;
  population: number;
  featureCode: string;
  adminCode: string;
  loc: {
    coordinates: [number, number]
  };
};

router.get('/', (req, res) => {
  const { search } = req.query;

  if (!search || typeof search !== 'string') {
    return res.status(400).json([]);
  }

  const searchTerm = search.toLowerCase();
  const citiesData = cities as unknown as CityData[];

  try {
    const matches = citiesData
      .filter(city =>
        city.name.toLowerCase().includes(searchTerm) ||
        city.country.toLowerCase().includes(searchTerm)
      )
      .map(city => {
        const lat = city.loc.coordinates[1];
        const lon = city.loc.coordinates[0];
        const timezones = find(lat, lon);
        const timezone = timezones && timezones.length > 0 ? timezones[0] : null;

        console.log('Backend - Processing city:', {
          name: city.name,
          coordinates: [lat, lon],
          foundTimezone: timezone
        });

        return {
          name: city.name,
          country: city.country,
          latitude: lat,
          longitude: lon,
          timezone: timezone
        };
      })
      .slice(0, 10);

    console.log('Backend - Sending matches:', matches);
    res.json(matches);
  } catch (error) {
    console.error('Error processing cities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;