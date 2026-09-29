import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsApi, companiesApi, notesApi } from '../api/client';
import { News, Company, Note } from '../types';
import { ExternalLink, Edit3, Save, Calendar, Globe, Briefcase, Activity } from 'lucide-react';

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<News | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const [noteContent, setNoteContent] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);

  useEffect(() => {
    const fetchArticleData = async () => {
      if (!id) return;
      try {
        const articleData = await newsApi.getById(parseInt(id, 10));
        setArticle(articleData);

        const companies = await companiesApi.getAll();
        const foundCompany = companies.find(c => c.id === articleData.company_id);
        if (foundCompany) setCompany(foundCompany);

        // Ideally fetch existing note from API, defaulting empty for now
        setNoteContent('');
      } catch (error) {
        console.error('Failed to fetch article', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticleData();
  }, [id]);

  const handleSaveNote = async () => {
    if (!id) return;
    try {
      await notesApi.create(parseInt(id, 10), noteContent);
      setIsEditingNote(false);
      alert('Note saved successfully');
    } catch (error) {
      console.error('Failed to save note', error);
    }
  };

  if (loading) return <div className="text-secondary animate-pulse">Loading article...</div>;
  if (!article) return <div className="text-red-500">Article not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-4">
        <Link to="/news" className="text-accent hover:underline text-sm">&larr; Back to News</Link>
      </div>

      <div className="bg-[#0f1c2e] border border-[#1e2a3b] p-8 rounded space-y-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold leading-tight flex-1 pr-8">{article.title}</h1>
          {company && (
            <Link
              to={`/company/${company.id}`}
              className="bg-[#152336] border border-[#1e2a3b] px-4 py-2 rounded text-center hover:border-accent transition-colors shrink-0"
            >
              <div className="font-bold text-lg">{company.ticker}</div>
              <div className="text-xs text-secondary">{company.name}</div>
            </Link>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-secondary border-b border-[#1e2a3b] pb-6">
          <div className="flex items-center space-x-1">
            <Globe className="w-4 h-4" />
            <span>{article.source}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(article.published_at).toLocaleDateString()}</span>
          </div>
          <div className="bg-[#1e2a3b] px-2 py-0.5 rounded text-mainText">
            {article.category}
          </div>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-accent hover:underline ml-auto"
          >
            <span>Original Article</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-2">AI Summary</h3>
            <p className="text-lg leading-relaxed">{article.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#152336] p-6 rounded border border-[#1e2a3b]">
            <div>
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-2 flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>Business Impact</span>
              </h3>
              <p className="text-sm">{article.business_impact}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-2 flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>Potential Market Impact</span>
              </h3>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  article.market_impact === 'Positive' ? 'bg-green-900 text-green-300' :
                  article.market_impact === 'Negative' ? 'bg-red-900 text-red-300' :
                  'bg-gray-800 text-gray-300'
                }`}>
                  {article.market_impact}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0f1c2e] border border-[#1e2a3b] rounded overflow-hidden">
        <div className="bg-[#152336] p-4 flex justify-between items-center border-b border-[#1e2a3b]">
          <h2 className="font-bold flex items-center space-x-2">
            <Edit3 className="w-5 h-5 text-accent" />
            <span>My Research Note</span>
          </h2>
          {!isEditingNote ? (
            <button
              onClick={() => setIsEditingNote(true)}
              className="text-accent text-sm hover:underline"
            >
              Edit Note
            </button>
          ) : (
            <button
              onClick={handleSaveNote}
              className="bg-accent text-background px-3 py-1 rounded text-sm font-medium flex items-center space-x-1"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          )}
        </div>
        <div className="p-4">
          {isEditingNote ? (
            <textarea
              className="w-full bg-[#1e2a3b] border border-[#2a3b52] rounded p-4 text-mainText min-h-[150px] focus:outline-none focus:border-accent"
              value={noteContent}
              onChange={e => setNoteContent(e.target.value)}
              placeholder="Write your personal analysis here..."
            />
          ) : (
            <div className="min-h-[100px] text-secondary">
              {noteContent ? (
                <p className="whitespace-pre-wrap text-mainText">{noteContent}</p>
              ) : (
                <p className="italic">No personal notes added yet. Click 'Edit Note' to add your research.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
