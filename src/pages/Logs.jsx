import { useStore } from '../store.jsx';
import { useNavigate } from 'react-router-dom';

export default function Logs() {
  const { workouts, routines } = useStore();
  const navigate = useNavigate();

  const counts = {};

  return (
    <div className="max-w-md mx-auto">
      <ul className="space-y-2">
        {workouts.map((log, idx) => {
          counts[log.routineId] = (counts[log.routineId] || 0) + 1;
          const count = counts[log.routineId];
          const routine = routines.find(r => r.id === log.routineId) || { name: 'Workout' };
          const date = new Date(log.date);
          return (
            <li key={idx} className="bg-white dark:bg-gray-800 p-3 rounded shadow">
              <span className="cursor-pointer" onClick={() => navigate(`/summary/${idx}`)}>
                {routine.name} - #{count} - {date.toLocaleString()}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
