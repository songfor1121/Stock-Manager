# Market Intelligence

A personal financial news and market research dashboard designed as a local-first application.
This tool streamlines the process of aggregating financial news, identifying business impacts, and writing personal research notes.

## Features

- **Watchlist Management**: Track specific companies across sectors.
- **News Aggregation**: View recent financial news filtered by company or category.
- **Market & Business Impact**: Quick visualizations of the potential impact of news events on tracked companies.
- **Personal Notes**: Attach personal research notes to individual news articles.
- **Local-first Persistence**: Uses `sql.js` saving to a local SQLite database file, eliminating the need for complex database servers.

## Project Structure

```
market-intelligence/
├── backend/                # Express API & sql.js persistence
│   ├── src/
│   │   ├── db/             # Database initialization and persistence logic
│   │   ├── routes/         # Express API routes
│   │   ├── services/       # AI and News mock services
│   │   └── types/          # TypeScript models
│   ├── data/               # Persistent storage (market.sqlite)
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── api/            # Axios API client setup
│   │   ├── components/     # Reusable UI layout and components
│   │   ├── pages/          # React Router pages
│   │   └── types/          # Frontend TypeScript models
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── README.md
```

## Prerequisites

- **Node.js**: v18.0.0 or higher is recommended.
- **npm**: v8.0.0 or higher.

## Installation & Setup (Mac)

Run the following commands in your terminal to set up the application on your Mac.

### 1. Install Backend Dependencies

```bash
cd market-intelligence/backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Running the Application

You need to start both the backend server and the frontend development server simultaneously in two separate terminal windows.

### Starting the Backend

The backend runs an Express server and initializes the local `market.sqlite` database using `sql.js`.

```bash
# Terminal 1
cd market-intelligence/backend
npm run dev
```

**Expected Localhost URL:** `http://localhost:3001`
*The local SQLite database will be generated at `market-intelligence/backend/data/market.sqlite`.*

### Starting the Frontend

The frontend uses Vite for a fast development experience.

```bash
# Terminal 2
cd market-intelligence/frontend
npm run dev
```

**Expected Localhost URL:** `http://localhost:5173` (or port dynamically assigned by Vite).

## Future Architecture (Phase 2)

Currently, the application uses mock data for both news retrieval and AI analysis. The foundation is laid to integrate real systems:

1. **AI Service Integration**: Connect the `backend/src/services/aiService.ts` to OpenAI or an open-source LLM API to auto-generate summaries and detect business/market impacts.
2. **Real News Sources**: Replace the mock data in `backend/src/services/newsService.ts` with real-time API integrations (e.g., RSS feeds, Alpha Vantage, Finnhub).
3. **Ecosystem Mapping**: Visualizing the "Related Companies" data to see how supply chain or competitive news impacts broader industry sectors.
