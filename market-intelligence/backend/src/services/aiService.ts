import { NewsCategory, MarketImpact } from '../types';

export interface AIAnalysisResult {
  company: string;
  category: NewsCategory;
  summary: string;
  businessImpact: string;
  marketImpact: MarketImpact;
  relatedCompanies: string[];
}

export class AIService {
  async analyzeArticle(articleContent: string): Promise<AIAnalysisResult> {
    // For now, this is a mock implementation.
    // The architecture is set up to easily swap this out with a real API call later.
    return {
      company: 'Unknown',
      category: 'Other',
      summary: 'Mock analysis summary for the article.',
      businessImpact: 'Unknown business impact.',
      marketImpact: 'Unclear',
      relatedCompanies: [],
    };
  }
}

export const aiService = new AIService();
