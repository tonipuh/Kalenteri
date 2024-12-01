import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { search } = req.query;

  console.log('Cities API called with:', { search });

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://backend:4000';
  console.log('Using backend URL:', backendUrl);

  try {
    const url = `${backendUrl}/cities?search=${search}`;
    console.log('Making request to:', url);

    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      console.log('Backend error:', text);
      throw new Error(`Backend responded with ${response.status}: ${text}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.log('Error in cities API:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
}