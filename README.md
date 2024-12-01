# Sunrise/Sunset Calendar

A web application for visualizing sunrise and sunset times across different locations worldwide.

## Features

- Sunrise/sunset calendar with daylight visualization
- City search with timezone support
- Solstice handling
- Responsive design
- Print support
- Clean UI

## Architecture

The application consists of two main parts:

### Backend (Node.js/Express)

- REST API built with Express
- City search functionality using all-the-cities database
- Timezone handling with geo-tz
- Sun calculations with suncalc

### Frontend (Next.js/React)

- Built with Next.js and React
- Tailwind CSS for styling
- Responsive grid layout
- Print-friendly design

## Setup

### Prerequisites

- Node.js (v18 or newer)
- npm

### Backend Setup

s1. Navigate to backend directory:

```
bash
cd backend
```

2. Install dependencies:

```
bash
npm install
```

3. Start the development server:

```
bash
npm run dev
```

The frontend will start on http://localhost:3000

## Environment Variables

### Backend

No environment variables needed by default. Server runs on port 4000.

### Frontend

Create a `.env.local` file in the frontend directory:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Development

The application uses TypeScript for both frontend and backend. Key files:

### Backend

- `src/index.ts` - Main server file
- `src/routes/cities.ts` - City search endpoints

### Frontend

- `src/components/Calendar.tsx` - Main calendar component
- `src/components/CommandPanel.tsx` - Control panel
- `src/components/CitySearch.tsx` - City search component

## Production Build

### Backend

```
bash
npm run build
npm start
```

### Frontend

```bash
bash
npm run build
npm start
```
