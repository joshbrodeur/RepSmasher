import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store.jsx';

export default function Summary() {
  const { index } = useParams();
  const { workouts, routines } = useStore();
  const idx = parseInt(index, 10);
  const log = workouts[idx] || workouts[workouts.length - 1];

  if (!log) return <div className="container">No log found</div>;

  const routine = routines.find(r => r.id === log.routineId) || { name: 'Workout' };
  const totalRest = log.records
    .filter(r => r.type === 'Rest')
    .reduce((sum, r) => sum + (r.end - r.start), 0);

  return (
    <div className="container">
      <h2>{routine.name}</h2>
      <p>Total time: {(log.totalTime / 1000).toFixed(1)}s</p>
      <p>Total rest: {(totalRest / 1000).toFixed(0)}s</p>
      {log.records.map((r, i) => (
        <div key={i}>
          {r.type === 'Rest'
            ? `Rest: ${Math.round((r.end - r.start) / 1000)}s`
            : `${r.type}: ${r.reps} reps @ ${r.weight}`}
        </div>
      ))}
      <p>
        <Link to="/">Back Home</Link>
      </p>
    </div>
  );
}
