import express, { Request, Response } from 'express';
import cors from 'cors';
import SunCalc from 'suncalc';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

interface SunlightResult {
  dawn: string;
  sunrise: string;
  sunset: string;
  dusk: string;
  type: 'nordic_summer' | 'nordic_winter' | 'normal' | 'fallback';
}

interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
  population?: number;
}

// Lisätään muutama suomalainen kaupunki testidataksi
const cities: City[] = [
  {
    name: "Helsinki",
    country: "Finland",
    lat: 60.1699,
    lon: 24.9384,
    population: 653867
  },
  {
    name: "Tampere",
    country: "Finland",
    lat: 61.4978,
    lon: 23.7610,
    population: 238140
  },
  {
    name: "Turku",
    country: "Finland",
    lat: 60.4518,
    lon: 22.2666,
    population: 186756
  },
  {
    name: "Oulu",
    country: "Finland",
    lat: 65.0121,
    lon: 25.4651,
    population: 205489
  },
  {
    name: "Rovaniemi",
    country: "Finland",
    lat: 66.5039,
    lon: 25.7294,
    population: 63042
  }
];

app.get('/api/sunlight', async (req, res) => {
  console.log('Sunlight request received:', req.query);

  const { lat, lon, date } = req.query;

  if (!lat || !lon || !date) {
    console.log('Missing parameters');
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const times = SunCalc.getTimes(
      new Date(date as string),
      Number(lat),
      Number(lon)
    );

    console.log('Calculated sun times:', times);
    res.json(times);
  } catch (error) {
    console.error('Error calculating sun times:', error);
    res.status(500).json({ error: 'Failed to calculate sun times' });
  }
});

app.get('/api/cities', async (req, res) => {
  const { search } = req.query;

  console.log('Received search request:', search);

  if (!search || typeof search !== 'string') {
    return res.status(400).json({ error: 'Search parameter is required' });
  }

  try {
    const filteredCities = cities.filter(city =>
      city.name.toLowerCase().includes(search.toLowerCase()) ||
      city.country.toLowerCase().includes(search.toLowerCase())
    );

    console.log(`Found ${filteredCities.length} cities`);

    res.json(filteredCities.slice(0, 10));
  } catch (error) {
    console.error('Error filtering cities:', error);
    res.status(500).json({
      error: 'Server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});