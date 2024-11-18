import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lat, lon, date } = req.query;

  console.log('Sunlight API called with:', { lat, lon, date });

  if (!lat || !lon || !date) {
    console.error('Missing parameters');
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const response = await fetch(
      `http://backend:4000/api/sunlight?lat=${lat}&lon=${lon}&date=${date}`
    );

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    console.log('Backend returned:', data);
    res.json(data);
  } catch (error) {
    console.error('Error in sunlight API:', error);
    res.status(500).json({ error: 'Failed to fetch sunlight data' });
  }
}