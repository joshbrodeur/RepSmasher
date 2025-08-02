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
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CreateWorkout from './pages/CreateWorkout.jsx';
import ChooseWorkout from './pages/ChooseWorkout.jsx';
import Logs from './pages/Logs.jsx';
import Workout from './pages/Workout.jsx';
import Summary from './pages/Summary.jsx';
import NotFound from './pages/NotFound.jsx';
import BottomNavigation from './components/BottomNavigation.jsx';

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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <BottomNavigation />
    </div>
  );
}
