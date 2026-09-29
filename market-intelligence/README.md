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

## Phase 2 Updates

In Phase 2, the application transitioned from mock data arrays to an active **Yahoo Finance RSS Integration**:
- News is fetched manually using the `Fetch Latest News` or company-specific `Fetch News` buttons in the dashboard and watchlist.
- Fetching operations hit `POST /api/news/fetch/:ticker` and `POST /api/news/fetch-all`.
- Extracted news properties (title, published date, source, original URL) are normalized.
- Duplicate articles are identified by their URL and ignored during SQL ingestion.
- The `fast-xml-parser` is used on the backend.
- **Note:** AI Analysis is not yet implemented. Fetched articles default to 'Other' and 'Unclear' impacts, accompanied by a placeholder summary.

## Future Architecture (Phase 3)

Phase 3 will build upon Phase 2's data ingestion to establish an intelligent analysis pipeline:

1. **AI Service Integration**: Connect the `backend/src/services/aiService.ts` to OpenAI or an open-source LLM API to auto-generate summaries, and detect business/market impacts based on the freshly ingested RSS text.
2. **Ecosystem Mapping**: Visualizing the "Related Companies" data to see how supply chain or competitive news impacts broader industry sectors.
3. **Automated Scheduling**: Shifting from manual UI-triggered fetching to cron/worker-based automated background fetching.
