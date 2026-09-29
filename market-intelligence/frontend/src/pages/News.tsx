import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsApi, companiesApi } from '../api/client';
import { News, Company } from '../types';
import { Search, Filter, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsData, companiesData] = await Promise.all([
          newsApi.getLatest(),
          companiesApi.getAll()
        ]);
        setNews(newsData);
        setCompanies(companiesData);
      } catch (error) {
        console.error('Failed to fetch news', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'Positive': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'Negative': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'Neutral': return <Minus className="w-4 h-4 text-gray-400" />;
      default: return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  if (loading) return <div className="text-secondary animate-pulse">Loading news...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#1e2a3b] pb-4">
        <h1 className="text-3xl font-bold text-accent">NEWS & INTELLIGENCE</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Search news..."
              className="bg-[#0f1c2e] border border-[#1e2a3b] rounded pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent text-mainText"
            />
          </div>
          <button className="bg-[#0f1c2e] border border-[#1e2a3b] px-4 py-2 rounded text-sm flex items-center space-x-2 hover:bg-[#152336] transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {news.map((article, index) => {
          const company = companies.find(c => c.id === article.company_id);
          return (
            <Link
              key={index}
              to={`/article/${index + 1}`}
              className="bg-[#0f1c2e] border border-[#1e2a3b] p-5 rounded hover:border-accent transition-colors block"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-accent">{company?.ticker || 'UNK'}</span>
                  <span className="text-xs text-secondary bg-[#1e2a3b] px-2 py-1 rounded">{article.category}</span>
                  <span className="text-xs text-secondary">{new Date(article.published_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm bg-[#152336] px-2 py-1 rounded">
                  {getImpactIcon(article.market_impact)}
                  <span className="text-secondary">{article.market_impact}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{article.title}</h3>
              <p className="text-secondary text-sm line-clamp-2">{article.summary}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NewsPage;
