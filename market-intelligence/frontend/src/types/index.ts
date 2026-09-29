export interface Company {
  id: number;
  name: string;
  ticker: string;
  sector: string;
  created_at?: string;
}

export type MarketImpact = 'Positive' | 'Neutral' | 'Negative' | 'Unclear';

export type NewsCategory =
  | 'Earnings'
  | 'Product'
  | 'Competition'
  | 'Regulation'
  | 'M&A'
  | 'Supply Chain'
  | 'Management'
  | 'Macro'
  | 'Other';

export interface News {
  id: number;
  company_id: number;
  title: string;
  source: string;
  url: string;
  published_at: string;
  category: NewsCategory;
  summary: string;
  business_impact: string;
  market_impact: MarketImpact;
  created_at?: string;
}

export interface Note {
  id: number;
  news_id: number;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface RelatedCompany {
  id: number;
  news_id: number;
  company_id: number;
}
