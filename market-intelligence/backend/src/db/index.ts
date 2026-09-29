import initSqlJs, { Database } from 'sql.js';
import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = path.join(__dirname, '../../data/market.sqlite');

let db: Database;

export async function initDb(): Promise<void> {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const filebuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(filebuffer);
    console.log('Loaded existing database.');
  } else {
    db = new SQL.Database();
    console.log('Created new database.');
    createTables();
    seedData();
    saveDb();
  }
}

function createTables() {
  db.run(`
    CREATE TABLE companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ticker TEXT NOT NULL,
      sector TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      source TEXT NOT NULL,
      url TEXT NOT NULL,
      published_at DATETIME NOT NULL,
      category TEXT NOT NULL,
      summary TEXT NOT NULL,
      business_impact TEXT NOT NULL,
      market_impact TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id)
    );

    CREATE TABLE notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      news_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (news_id) REFERENCES news(id)
    );

    CREATE TABLE related_companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      news_id INTEGER NOT NULL,
      company_id INTEGER NOT NULL,
      FOREIGN KEY (news_id) REFERENCES news(id),
      FOREIGN KEY (company_id) REFERENCES companies(id)
    );
  `);
}

function seedData() {
  // Insert initial companies
  db.run(`
    INSERT INTO companies (name, ticker, sector) VALUES
    ('NVIDIA', 'NVDA', 'Technology'),
    ('AMD', 'AMD', 'Technology'),
    ('TSMC', 'TSM', 'Technology'),
    ('Apple', 'AAPL', 'Technology'),
    ('Microsoft', 'MSFT', 'Technology'),
    ('Amazon', 'AMZN', 'Consumer Discretionary'),
    ('Alphabet', 'GOOGL', 'Technology'),
    ('Meta', 'META', 'Technology'),
    ('Tesla', 'TSLA', 'Consumer Discretionary');
  `);
}

export function saveDb(): void {
  const data = db.export();
  const buffer = Buffer.from(data);
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, buffer);
}

export function getDb(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
}
