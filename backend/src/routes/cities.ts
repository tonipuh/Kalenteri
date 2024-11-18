import express from 'express';
import { City } from '../types/types';
import cities from 'all-the-cities';

const router = express.Router();

router.get('/cities', (req, res) => {
    const searchTerm = req.query.search?.toString().toLowerCase();
    console.log('Received search request:', searchTerm);

    if (!searchTerm) {
        return res.status(400).json({ error: 'Search term is required' });
    }

    const results = cities
        .filter(city =>
            city.name.toLowerCase().includes(searchTerm) ||
            city.country.toLowerCase().includes(searchTerm)
        )
        .slice(0, 10)
        .map(city => ({
            name: city.name,
            country: city.country,
            lat: city.lat,
            lon: city.lon,
            population: city.population
        }));

    console.log('Found', results.length, 'cities');
    res.json(results);
});

export default router;