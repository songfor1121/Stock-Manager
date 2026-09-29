import { News, Company } from '../types';
import { getDb, saveDb } from '../db';
import { yahooFinanceService } from './yahooFinanceService';

export interface FetchResult {
  ticker?: string;
  fetched: number;
  inserted: number;
  duplicates: number;
}

export interface FetchAllResult {
  companies: number;
  fetched: number;
  inserted: number;
  duplicates: number;
  failedTickers: string[];
}

export class NewsService {

  async getLatestNews(): Promise<News[]> {
    const db = getDb();
    const result = db.exec('SELECT * FROM news ORDER BY published_at DESC LIMIT 50');
    if (result.length > 0) {
      const columns = result[0].columns;
      const values = result[0].values;
      return values.map(val => {
        const obj: any = {};
        columns.forEach((col, index) => {
          obj[col] = val[index];
        });
        return obj as News;
      });
    }
    return [];
  }

  async getCompanyNews(ticker: string): Promise<News[]> {
    const db = getDb();
    const result = db.exec(`
      SELECT n.* FROM news n
      JOIN companies c ON n.company_id = c.id
      WHERE c.ticker = ?
      ORDER BY n.published_at DESC
    `, [ticker]);

    if (result.length > 0) {
      const columns = result[0].columns;
      const values = result[0].values;
      return values.map(val => {
        const obj: any = {};
        columns.forEach((col, index) => {
          obj[col] = val[index];
        });
        return obj as News;
      });
    }
    return [];
  }

  async getNewsById(id: number): Promise<News | null> {
    const db = getDb();
    const result = db.exec('SELECT * FROM news WHERE id = ?', [id]);
    if (result.length > 0) {
      const columns = result[0].columns;
      const values = result[0].values[0];
      const obj: any = {};
      columns.forEach((col, index) => {
        obj[col] = values[index];
      });
      return obj as News;
    }
    return null;
  }

  async fetchNewsForTicker(ticker: string): Promise<FetchResult> {
    const db = getDb();

    // Find company ID
    const companyResult = db.exec('SELECT id FROM companies WHERE ticker = ?', [ticker]);
    if (companyResult.length === 0) {
      throw new Error(`Company with ticker ${ticker} not found`);
    }
    const companyId = companyResult[0].values[0][0] as number;

    const articles = await yahooFinanceService.getYahooFinanceNews(ticker);

    let inserted = 0;
    let duplicates = 0;

    for (const article of articles) {
      // Deduplicate by URL
      const existCheck = db.exec('SELECT id FROM news WHERE url = ?', [article.url]);
      if (existCheck.length > 0) {
        duplicates++;
        continue;
      }

      // Insert new article
      // Phase 2 requires category 'Other' and market_impact 'Unclear'.
      // summary empty or message placeholder.
      db.run(`
        INSERT INTO news (
          company_id, title, source, url, published_at,
          category, summary, business_impact, market_impact
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        companyId,
        article.title,
        article.source,
        article.url,
        article.publishedAt,
        'Other',
        '', // Leaving empty for Phase 3 AI Analysis
        '', // Leaving empty for Phase 3 AI Analysis
        'Unclear'
      ]);
      inserted++;
    }

    if (inserted > 0) {
      saveDb();
    }

    return {
      ticker,
      fetched: articles.length,
      inserted,
      duplicates
    };
  }

  async fetchAllNews(): Promise<FetchAllResult> {
    const db = getDb();
    const companyResult = db.exec('SELECT ticker FROM companies');

    let companiesProcessed = 0;
    let totalFetched = 0;
    let totalInserted = 0;
    let totalDuplicates = 0;
    const failedTickers: string[] = [];

    if (companyResult.length > 0) {
      const tickers = companyResult[0].values.map(v => v[0] as string);
      companiesProcessed = tickers.length;

      for (const ticker of tickers) {
        try {
          const result = await this.fetchNewsForTicker(ticker);
          totalFetched += result.fetched;
          totalInserted += result.inserted;
          totalDuplicates += result.duplicates;

          // Delay respectfully to avoid hammering the endpoint
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Failed to fetch for ${ticker}`, error);
          failedTickers.push(ticker);
        }
      }
    }

    return {
      companies: companiesProcessed,
      fetched: totalFetched,
      inserted: totalInserted,
      duplicates: totalDuplicates,
      failedTickers
    };
  }
}

export const newsService = new NewsService();
