/*
Redesign this screen using Tailwind CSS:
- Use a dark theme
- Add a header with title + theme toggle
- Wrap the stats in a rounded card
- Use bottom nav with icons for Home, Create, Logs
- Use large touch targets and spacing
- Follow a workout app aesthetic
*/

import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CreateWorkout from './pages/CreateWorkout.jsx';
import ChooseWorkout from './pages/ChooseWorkout.jsx';
import Logs from './pages/Logs.jsx';
import Workout from './pages/Workout.jsx';
import Summary from './pages/Summary.jsx';
import Layout from './components/Layout.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateWorkout />} />
        <Route path="/choose" element={<ChooseWorkout />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/workout/:id" element={<Workout />} />
        <Route path="/summary/:index" element={<Summary />} />
      </Route>
    </Routes>
  );
}
