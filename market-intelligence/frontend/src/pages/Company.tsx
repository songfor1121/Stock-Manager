import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { companiesApi } from '../api/client';
import { Company, News } from '../types';
import { Building2, Newspaper, Target, Network } from 'lucide-react';

const CompanyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!id) return;
      try {
        const [companies, newsData] = await Promise.all([
          companiesApi.getAll(),
          companiesApi.getNews(parseInt(id, 10))
        ]);
        const found = companies.find(c => c.id === parseInt(id, 10));
        if (found) setCompany(found);
        setNews(newsData);
      } catch (error) {
        console.error('Failed to fetch company data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, [id]);

  if (loading) return <div className="text-secondary animate-pulse">Loading company data...</div>;
  if (!company) return <div className="text-red-500">Company not found.</div>;

  return (
    <div className="space-y-8">
      <div className="bg-[#0f1c2e] border border-[#1e2a3b] p-8 rounded flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
          <div className="flex space-x-4 text-secondary">
            <span className="flex items-center space-x-1">
              <Building2 className="w-4 h-4" />
              <span>{company.ticker}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>{company.sector}</span>
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-accent">{news.length}</div>
          <div className="text-sm text-secondary uppercase tracking-wider">Analyzed Articles</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold border-b border-[#1e2a3b] pb-2 flex items-center space-x-2">
            <Newspaper className="w-5 h-5 text-accent" />
            <span>Recent News</span>
          </h2>
          <div className="space-y-4">
            {news.map((article, index) => (
              <Link
                key={index}
                to={`/article/${index + 1}`}
                className="bg-[#0f1c2e] border border-[#1e2a3b] p-4 rounded hover:border-accent transition-colors block"
              >
                <div className="flex justify-between text-xs text-secondary mb-2">
                  <span className="bg-[#1e2a3b] px-2 py-1 rounded">{article.category}</span>
                  <span>{new Date(article.published_at).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                <p className="text-sm text-secondary line-clamp-2">{article.summary}</p>
              </Link>
            ))}
            {news.length === 0 && <div className="text-secondary">No news found for this company.</div>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0f1c2e] border border-[#1e2a3b] p-6 rounded">
            <h2 className="text-xl font-bold border-b border-[#1e2a3b] pb-2 mb-4 flex items-center space-x-2">
              <Network className="w-5 h-5 text-accent" />
              <span>Related Ecosystem</span>
            </h2>
            <p className="text-sm text-secondary">
              Ecosystem mapping will appear here in Phase 2.
            </p>
          </div>

          <div className="bg-[#0f1c2e] border border-[#1e2a3b] p-6 rounded">
            <h2 className="text-xl font-bold border-b border-[#1e2a3b] pb-2 mb-4">Personal Notes</h2>
            <p className="text-sm text-secondary">
              Aggregated company notes will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
