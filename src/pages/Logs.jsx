import { useStore } from '../store.js';
import { useNavigate } from 'react-router-dom';

export default function Logs() {
  const { workouts, routines } = useStore();
  const navigate = useNavigate();

  const counts = {};

  return (
    <div className="container">
      <ul className="list">
        {workouts.map((log, idx) => {
          counts[log.routineId] = (counts[log.routineId] || 0) + 1;
          const count = counts[log.routineId];
          const routine = routines.find(r => r.id === log.routineId) || { name: 'Workout' };
          const date = new Date(log.date);
          return (
            <li key={idx}>
              <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/summary/${idx}`)}>
                {routine.name} - #{count} - {date.toLocaleString()}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
