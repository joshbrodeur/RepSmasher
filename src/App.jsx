/*
Redesign this screen using Tailwind CSS:
- Use a dark theme
- Add a header with title + theme toggle
- Wrap the stats in a rounded card
- Use bottom nav with icons for Home, Create, Logs
- Use large touch targets and spacing
- Follow a workout app aesthetic
*/

import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CreateWorkout from './pages/CreateWorkout.jsx';
import ChooseWorkout from './pages/ChooseWorkout.jsx';
import Logs from './pages/Logs.jsx';
import Workout from './pages/Workout.jsx';
import Summary from './pages/Summary.jsx';

export default function App() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <div className="min-h-screen pb-16 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
      <header className="flex items-center justify-between p-4 shadow-md bg-white dark:bg-gray-800">
        <h1 className="text-xl font-bold">RepSmasher</h1>
        <button
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setDark(d => !d)}
        >
          {dark ? '🌙' : '☀️'}
        </button>
      </header>
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateWorkout />} />
          <Route path="/choose" element={<ChooseWorkout />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/workout/:id" element={<Workout />} />
          <Route path="/summary/:index" element={<Summary />} />
        </Routes>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-around py-2">
        <Link to="/" className="flex flex-col items-center" aria-label="Home">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75h-5.25a.75.75 0 01-.75-.75V13.5H9.75v7.5a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/create" className="flex flex-col items-center" aria-label="Create">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs mt-1">Create</span>
        </Link>
        <Link to="/logs" className="flex flex-col items-center" aria-label="Logs">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-xs mt-1">Logs</span>
        </Link>
      </nav>
    </div>
  );
}
