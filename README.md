# Sunrise/Sunset Calendar

A web application for visualizing sunrise and sunset times across different locations worldwide.

## Features

- Sunrise/sunset calendar with daylight visualization
- City search with timezone support
- Solstice handling
- Responsive design
- Print support
- Clean UI
- Excel import support for event data
  - Date (Column A)
  - Time (Column B)
  - Count (Column C)
  - Automatic grouping by hour
  - Visual representation in calendar

## Architecture

The application consists of two main parts:

### Backend (Node.js/Express)

- REST API built with Express
- City search functionality using all-the-cities database
- Timezone handling with geo-tz
- Sun calculations with suncalc
- multer (file upload handling)
- xlsx (Excel file processing)

### Frontend (Next.js/React)

- Built with Next.js and React
- Tailwind CSS for styling
- Responsive grid layout
- Print-friendly design
- react-toastify (user notifications)

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

## Excel Import Format

The application accepts Excel files (.xlsx, .xls) with the following format:

| pvm        | kello | kpl |
| ---------- | ----- | --- |
| 2024-01-01 | 08:15 | 5   |
| 2024-01-01 | 08:30 | 3   |

- Column A: Date in YYYY-MM-DD format
- Column B: Time in HH:mm format
- Column C: Numeric count

Events are automatically grouped by hour and displayed in the calendar.

## API Endpoints

### POST /api/events

- Accepts multipart/form-data with Excel file
- Returns grouped events data
- Error handling for invalid files and formats
