import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Watchlist from './pages/Watchlist';
import News from './pages/News';
import Company from './pages/Company';
import Article from './pages/Article';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="news" element={<News />} />
          <Route path="company/:id" element={<Company />} />
          <Route path="article/:id" element={<Article />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
