import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <div className="min-h-screen pb-16 font-sans bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">RepSmasher</h1>
        <button className="text-blue-400" onClick={() => setDark(d => !d)}>
          {dark ? '☀️' : '🌙'}
        </button>
      </header>

      <Outlet />

      <nav className="fixed bottom-0 left-0 w-full bg-gray-800 border-t border-gray-700 flex justify-around p-2">
        <Link to="/" className="text-white" aria-label="Home">🏠</Link>
        <Link to="/create" className="text-white" aria-label="Create">➕</Link>
        <Link to="/logs" className="text-white" aria-label="Logs">📊</Link>
      </nav>
    </div>
  );
}
