import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CreateWorkout from './pages/CreateWorkout.jsx';
import ChooseWorkout from './pages/ChooseWorkout.jsx';
import Logs from './pages/Logs.jsx';
import Workout from './pages/Workout.jsx';
import Summary from './pages/Summary.jsx';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/create">Create Workout</Link>
        <Link to="/choose">Choose Workout</Link>
        <Link to="/logs">Logs</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateWorkout />} />
        <Route path="/choose" element={<ChooseWorkout />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/workout/:id" element={<Workout />} />
        <Route path="/summary/:index" element={<Summary />} />
      </Routes>
    </div>
  );
}
