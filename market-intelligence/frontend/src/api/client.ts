import axios from 'axios';
import { Company, News, Note } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Hardcoded for demo/local use per instructions
});

export const companiesApi = {
  getAll: async () => {
    const response = await api.get<Company[]>('/companies');
    return response.data;
  },
  getNews: async (id: number) => {
    const response = await api.get<News[]>(`/companies/${id}/news`);
    return response.data;
  },
  create: async (data: Omit<Company, 'id' | 'created_at'>) => {
    const response = await api.post('/companies', data);
    return response.data;
  },
  update: async (id: number, data: Omit<Company, 'id' | 'created_at'>) => {
    const response = await api.put(`/companies/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
  }
};

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

export const newsApi = {
  getLatest: async () => {
    const response = await api.get<News[]>('/news');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get<News>(`/news/${id}`);
    return response.data;
  },
  fetchForTicker: async (ticker: string) => {
    const response = await api.post<FetchResult>(`/news/fetch/${ticker}`);
    return response.data;
  },
  fetchAll: async () => {
    const response = await api.post<FetchAllResult>('/news/fetch-all');
    return response.data;
  }
};

export const notesApi = {
  create: async (news_id: number, content: string) => {
    const response = await api.post('/notes', { news_id, content });
    return response.data;
  },
  update: async (id: number, content: string) => {
    const response = await api.put(`/notes/${id}`, { content });
    return response.data;
  }
};

export default api;
