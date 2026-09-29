import React, { useEffect, useState } from 'react';
import { companiesApi, newsApi } from '../api/client';
import { Company } from '../types';
import { Plus, Trash2, Edit2, X, Check, RefreshCw } from 'lucide-react';

const Watchlist: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [fetchingTicker, setFetchingTicker] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', ticker: '', sector: '' });

  const fetchCompanies = async () => {
    try {
      const data = await companiesApi.getAll();
      setCompanies(data);
    } catch (error) {
      console.error('Failed to fetch companies', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleAdd = async () => {
    if (!newCompany.name || !newCompany.ticker || !newCompany.sector) return;
    try {
      await companiesApi.create(newCompany);
      setNewCompany({ name: '', ticker: '', sector: '' });
      setIsAdding(false);
      fetchCompanies();
    } catch (error) {
      console.error('Failed to create company', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this company?')) return;
    try {
      await companiesApi.delete(id);
      fetchCompanies();
    } catch (error) {
      console.error('Failed to delete company', error);
    }
  };

  const handleFetchNews = async (ticker: string) => {
    setFetchingTicker(ticker);
    try {
      const summary = await newsApi.fetchForTicker(ticker);
      alert(`Fetched ${summary.fetched} articles.\nInserted: ${summary.inserted}\nDuplicates skipped: ${summary.duplicates}`);
    } catch (error) {
      console.error('Failed to fetch news', error);
      alert('Failed to fetch news. Please try again.');
    } finally {
      setFetchingTicker(null);
    }
  };

  if (loading) return <div className="text-secondary animate-pulse">Loading watchlist...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#1e2a3b] pb-4">
        <h1 className="text-3xl font-bold text-accent">WATCHLIST</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-accent text-background px-4 py-2 rounded font-medium flex items-center space-x-2 hover:bg-opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span>Add Company</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-[#0f1c2e] p-4 border border-accent rounded mb-6 flex space-x-4 items-end">
          <div className="flex-1">
            <label className="block text-xs text-secondary mb-1">Company Name</label>
            <input
              className="w-full bg-[#1e2a3b] border-none rounded p-2 text-mainText focus:ring-1 focus:ring-accent outline-none"
              value={newCompany.name}
              onChange={e => setNewCompany({...newCompany, name: e.target.value})}
              placeholder="e.g. Palantir"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-secondary mb-1">Ticker</label>
            <input
              className="w-full bg-[#1e2a3b] border-none rounded p-2 text-mainText focus:ring-1 focus:ring-accent outline-none"
              value={newCompany.ticker}
              onChange={e => setNewCompany({...newCompany, ticker: e.target.value})}
              placeholder="e.g. PLTR"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-secondary mb-1">Sector</label>
            <input
              className="w-full bg-[#1e2a3b] border-none rounded p-2 text-mainText focus:ring-1 focus:ring-accent outline-none"
              value={newCompany.sector}
              onChange={e => setNewCompany({...newCompany, sector: e.target.value})}
              placeholder="e.g. Technology"
            />
          </div>
          <div className="flex space-x-2">
            <button onClick={handleAdd} className="bg-green-600 text-white p-2 rounded hover:bg-green-500">
              <Check className="w-5 h-5" />
            </button>
            <button onClick={() => setIsAdding(false)} className="bg-red-600 text-white p-2 rounded hover:bg-red-500">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#0f1c2e] border border-[#1e2a3b] rounded overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#152336] text-secondary text-sm">
              <th className="p-4 font-medium w-1/3">Company</th>
              <th className="p-4 font-medium w-1/4">Ticker</th>
              <th className="p-4 font-medium w-1/4">Sector</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(company => (
              <tr key={company.id} className="border-t border-[#1e2a3b] hover:bg-[#152336] transition-colors">
                <td className="p-4 font-bold">{company.name}</td>
                <td className="p-4 font-mono text-accent">{company.ticker}</td>
                <td className="p-4 text-secondary">{company.sector}</td>
                <td className="p-4 flex justify-end items-center space-x-4 text-secondary">
                  <button
                    onClick={() => handleFetchNews(company.ticker)}
                    disabled={fetchingTicker === company.ticker}
                    className="flex items-center space-x-1 text-xs bg-[#1e2a3b] px-2 py-1 rounded hover:text-accent disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${fetchingTicker === company.ticker ? 'animate-spin' : ''}`} />
                    <span>{fetchingTicker === company.ticker ? 'Fetching...' : 'Fetch News'}</span>
                  </button>
                  <button className="hover:text-accent transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(company.id)} className="hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {companies.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-secondary">
                  Watchlist is empty. Add a company to track it.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Watchlist;
