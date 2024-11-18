import express from 'express';
import { City } from '../types/types';
import { majorCities } from '../data/cities';

const router = express.Router();

router.get('/cities', (req, res) => {
    const searchTerm = req.query.search?.toString().toLowerCase();
    console.log('Received search request:', searchTerm);
    console.log('Major cities available:', majorCities.length);
    console.log('First city in list:', majorCities[0]);

    if (!searchTerm) {
        return res.status(400).json({ error: 'Search term is required' });
    }

    try {
        console.log('Starting city search for:', searchTerm);
        const results = majorCities
            .filter(city => {
                const cityName = city.name.toLowerCase();
                const cityCountry = city.country.toLowerCase();
                const matches = cityName.includes(searchTerm) || cityCountry.includes(searchTerm);
                console.log(`Checking ${city.name}: matches=${matches}`);
                return matches;
            })
            .map(city => ({
                name: city.name,
                country: city.country,
                lat: city.lat,
                lon: city.lon,
                population: city.population
            }));

        console.log('Found', results.length, 'cities');
        console.log('Results:', results);
        res.json(results);
    } catch (error) {
        console.error('Error in cities endpoint:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});

export default router;