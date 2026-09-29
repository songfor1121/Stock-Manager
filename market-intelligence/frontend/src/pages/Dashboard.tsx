import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { companiesApi, newsApi } from '../api/client';
import { Company, News } from '../types';
import { AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [recentNews, setRecentNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [companiesData, newsData] = await Promise.all([
          companiesApi.getAll(),
          newsApi.getLatest()
        ]);
        setCompanies(companiesData);
        setRecentNews(newsData.slice(0, 5)); // Just take top 5 recent
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'Positive': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'Negative': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'Neutral': return <Minus className="w-4 h-4 text-gray-400" />;
      default: return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  if (loading) return <div className="text-secondary animate-pulse">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-accent border-b border-[#1e2a3b] pb-2">WATCHLIST OVERVIEW</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map(company => (
            <Link
              key={company.id}
              to={`/company/${company.id}`}
              className="bg-[#0f1c2e] border border-[#1e2a3b] p-4 rounded hover:border-accent transition-colors block"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{company.name}</h3>
                  <span className="text-secondary text-sm">{company.ticker}</span>
                </div>
                <div className="bg-[#1e2a3b] px-2 py-1 rounded text-xs text-accent">
                  {/* Mocking article count for layout. Ideally backend supplies this */}
                  {Math.floor(Math.random() * 10) + 1} articles
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-accent border-b border-[#1e2a3b] pb-2">RECENT NEWS</h2>
        <div className="bg-[#0f1c2e] border border-[#1e2a3b] rounded overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#152336] text-secondary text-sm">
                <th className="p-3 font-medium">Company</th>
                <th className="p-3 font-medium">Headline</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">Impact</th>
              </tr>
            </thead>
            <tbody>
              {recentNews.map((article, index) => {
                const company = companies.find(c => c.id === article.company_id);
                return (
                  <tr key={index} className="border-t border-[#1e2a3b] hover:bg-[#152336] transition-colors">
                    <td className="p-3 text-sm font-medium">{company?.ticker || 'UNK'}</td>
                    <td className="p-3">
                      <Link to={`/article/${index + 1}`} className="hover:text-accent transition-colors block truncate max-w-md">
                        {article.title}
                      </Link>
                    </td>
                    <td className="p-3 text-sm text-secondary">
                      <span className="bg-[#1e2a3b] px-2 py-1 rounded">{article.category}</span>
                    </td>
                    <td className="p-3 flex items-center space-x-2 text-sm">
                      {getImpactIcon(article.market_impact)}
                      <span>{article.market_impact}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-accent border-b border-[#1e2a3b] pb-2">RECENT NOTES</h2>
        <div className="text-secondary p-4 bg-[#0f1c2e] border border-[#1e2a3b] rounded text-center">
          No recent notes found. View an article to add a note.
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
