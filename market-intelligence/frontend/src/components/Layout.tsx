import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, List, Newspaper, BarChart2 } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Activity },
    { name: 'Watchlist', path: '/watchlist', icon: List },
    { name: 'News', path: '/news', icon: Newspaper },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-mainText font-sans">
      <header className="bg-[#0a182b] border-b border-[#1e2a3b] p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-accent font-bold text-xl tracking-wide">
            <BarChart2 className="w-6 h-6" />
            <span>MARKET INTELLIGENCE</span>
          </Link>
          <nav className="flex space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-accent ${
                    isActive ? 'text-accent' : 'text-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-6 max-w-7xl">
        <Outlet />
      </main>

      <footer className="bg-[#0a182b] border-t border-[#1e2a3b] p-4 text-center text-secondary text-sm">
        <p>Personal Market Intelligence Terminal</p>
      </footer>
    </div>
  );
};

export default Layout;
