import { XMLParser } from 'fast-xml-parser';

export interface NormalizedArticle {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  ticker: string;
}

export class YahooFinanceService {
  private getYahooFinanceRssUrl(ticker: string): string {
    return `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${ticker}&region=US&lang=en-US`;
  }

  async getYahooFinanceNews(ticker: string): Promise<NormalizedArticle[]> {
    try {
      const url = this.getYahooFinanceRssUrl(ticker);

      const response = await fetch(url, {
        method: 'GET',
        // Setting a reasonable timeout to prevent hanging requests as requested.
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch RSS for ${ticker}: ${response.statusText}`);
      }

      const xmlText = await response.text();

      if (!xmlText || xmlText.trim() === '') {
        return [];
      }

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
      });

      const parsedXml = parser.parse(xmlText);

      const items = parsedXml?.rss?.channel?.item;
      if (!items) {
        return [];
      }

      const articlesRaw = Array.isArray(items) ? items : [items];

      return articlesRaw.map((item: any) => this.normalizeArticle(item, ticker));
    } catch (error) {
      console.error(`Error fetching news for ${ticker}:`, error);
      return []; // Return empty array on error, don't crash
    }
  }

  private normalizeArticle(item: any, ticker: string): NormalizedArticle {
    // Yahoo RSS typically uses 'title' and 'link'.
    // Source is often embedded or default to 'Yahoo Finance'.
    let sourceName = 'Yahoo Finance';

    // Sometimes 'source' is an object or string in Yahoo RSS, we try to extract it if available.
    if (item.source) {
       if (typeof item.source === 'string') {
           sourceName = item.source;
       } else if (item.source['#text']) {
           sourceName = item.source['#text'];
       }
    }

    return {
      title: item.title || 'Untitled Article',
      source: sourceName,
      url: item.link || '',
      publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      ticker: ticker
    };
  }
}

export const yahooFinanceService = new YahooFinanceService();
