import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { search } = req.query;

  if (!search || typeof search !== 'string') {
    return res.status(400).json({ error: 'Search parameter is required' });
  }

  try {
    console.log('Fetching cities with search term:', search); // Debug-loki
    const response = await fetch(`http://backend:4000/api/cities?search=${encodeURIComponent(search)}`);

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error in /api/cities:', error);
    res.status(500).json({
      error: 'Failed to fetch cities',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}