import { News } from '../types';

export class NewsService {
  private mockNews: Omit<News, 'id'>[] = [
    // NVIDIA (NVDA) - ID 1
    {
      company_id: 1,
      title: '[DEMO] NVIDIA Announces Next-Gen AI Accelerator',
      source: 'Tech News',
      url: 'https://example.com/nvda-ai',
      published_at: new Date().toISOString(),
      category: 'Product',
      summary: 'NVIDIA has announced its next generation of AI accelerators offering 3x performance over the previous generation.',
      business_impact: 'Expected to maintain dominance in AI hardware market and boost data center revenue.',
      market_impact: 'Positive'
    },
    {
      company_id: 1,
      title: '[DEMO] NVIDIA Q3 Earnings Beat Expectations',
      source: 'Financial Times',
      url: 'https://example.com/nvda-q3',
      published_at: new Date().toISOString(),
      category: 'Earnings',
      summary: 'Q3 revenue significantly beat analyst expectations driven by strong data center demand.',
      business_impact: 'Strong financial position, higher margins, increased guidance.',
      market_impact: 'Positive'
    },
    {
      company_id: 1,
      title: '[DEMO] Supply Chain Constraints Affect NVIDIA Deliveries',
      source: 'Hardware Times',
      url: 'https://example.com/nvda-supply',
      published_at: new Date().toISOString(),
      category: 'Supply Chain',
      summary: 'Advanced packaging constraints at TSMC are limiting the delivery of NVIDIA top-tier AI chips.',
      business_impact: 'Potential short-term revenue bottleneck despite high demand.',
      market_impact: 'Neutral'
    },
    // AMD (AMD) - ID 2
    {
      company_id: 2,
      title: '[DEMO] AMD Launches MI300 Series to Compete with NVIDIA',
      source: 'Silicon Review',
      url: 'https://example.com/amd-mi300',
      published_at: new Date().toISOString(),
      category: 'Product',
      summary: 'AMD officially launched its new MI300 data center APUs, targeting the generative AI market.',
      business_impact: 'Opens up new TAM in AI data center, creating a strong alternative to existing solutions.',
      market_impact: 'Positive'
    },
    {
      company_id: 2,
      title: '[DEMO] AMD Gains Server Market Share',
      source: 'Market Watch',
      url: 'https://example.com/amd-server',
      published_at: new Date().toISOString(),
      category: 'Competition',
      summary: 'Recent data shows AMD EPYC processors continuing to take server market share from competitors.',
      business_impact: 'Steady growth in high-margin enterprise sector.',
      market_impact: 'Positive'
    },
    // TSMC (TSM) - ID 3
    {
      company_id: 3,
      title: '[DEMO] TSMC Expands Advanced Packaging Capacity',
      source: 'Global Tech',
      url: 'https://example.com/tsm-packaging',
      published_at: new Date().toISOString(),
      category: 'Supply Chain',
      summary: 'TSMC is aggressively expanding its CoWoS packaging capacity to meet AI chip demand.',
      business_impact: 'Will alleviate bottlenecks for key customers like NVIDIA and AMD, boosting TSMC revenue.',
      market_impact: 'Positive'
    },
    {
      company_id: 3,
      title: '[DEMO] TSMC Reports Slight Margin Contraction',
      source: 'Investor News',
      url: 'https://example.com/tsm-margin',
      published_at: new Date().toISOString(),
      category: 'Earnings',
      summary: 'Higher electricity costs and node transition expenses led to a slight dip in gross margin for TSMC.',
      business_impact: 'Short term profitability impact while long term demand remains robust.',
      market_impact: 'Negative'
    },
    // Apple (AAPL) - ID 4
    {
      company_id: 4,
      title: '[DEMO] Apple Prepares Custom AI Chips for Data Centers',
      source: 'Mac Insider',
      url: 'https://example.com/aapl-ai',
      published_at: new Date().toISOString(),
      category: 'Product',
      summary: 'Apple is reportedly developing its own server-side AI chips to power future Apple Intelligence features.',
      business_impact: 'Could reduce reliance on third-party hardware and improve margins on AI services.',
      market_impact: 'Positive'
    },
    // Microsoft (MSFT) - ID 5
    {
      company_id: 5,
      title: '[DEMO] Microsoft Azure AI Revenue Growth Accelerates',
      source: 'Cloud Weekly',
      url: 'https://example.com/msft-azure',
      published_at: new Date().toISOString(),
      category: 'Earnings',
      summary: 'Microsoft reported accelerating growth in its Azure cloud division, heavily driven by AI services.',
      business_impact: 'Validates heavy investment in OpenAI partnership and AI infrastructure.',
      market_impact: 'Positive'
    },
    // Amazon (AMZN) - ID 6
    {
      company_id: 6,
      title: '[DEMO] AWS Unveils Next-Gen Trainium Chips',
      source: 'Cloud Weekly',
      url: 'https://example.com/amzn-trainium',
      published_at: new Date().toISOString(),
      category: 'Product',
      summary: 'Amazon Web Services introduced new custom silicon designed for training foundational AI models cost-effectively.',
      business_impact: 'Strengthens AWS position as a cost-effective cloud AI provider.',
      market_impact: 'Positive'
    }
  ];

  async getLatestNews(): Promise<Omit<News, 'id'>[]> {
    // Return sample demo data
    return this.mockNews;
  }

  async getCompanyNews(ticker: string): Promise<Omit<News, 'id'>[]> {
    // For now, return sample demo data
    // Future: Connect to real news APIs based on the ticker
    // Simplified: Just returning the mock data array for demo.
    return this.mockNews;
  }
}

export const newsService = new NewsService();
