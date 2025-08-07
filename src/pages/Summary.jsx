import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store.jsx';

export default function Summary() {
  const { index } = useParams();
  const { workouts, routines } = useStore();
  const idx = parseInt(index, 10);
  const log = workouts[idx] || workouts[workouts.length - 1];

  if (!log) return <div className="max-w-md mx-auto">No log found</div>;

  const routine = routines.find(r => r.id === log.routineId) || { name: 'Workout' };
  const totalRest = log.records
    .filter(r => r.type === 'Rest')
    .reduce((sum, r) => sum + (r.end - r.start), 0);

  const exerciseStats = log.records
    .filter(r => r.type !== 'Rest')
    .reduce((acc, r) => {
      if (!acc[r.type]) acc[r.type] = { sets: 0, totalReps: 0 };
      acc[r.type].sets += 1;
      acc[r.type].totalReps += r.reps;
      return acc;
    }, {});

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-lg font-bold text-center">{routine.name}</h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-2">
        <p>Total time: {(log.totalTime / 1000).toFixed(1)}s</p>
        <p>Total rest: {(totalRest / 1000).toFixed(0)}s</p>
        {Object.entries(exerciseStats).map(([name, stat]) => (
          <div key={name}>
            {name}: {stat.sets} sets avg {(stat.totalReps / stat.sets).toFixed(1)} reps
          </div>
        ))}
        {log.records.map((r, i) => (
          <div key={i}>
            {r.type === 'Rest'
              ? `Rest: ${Math.round((r.end - r.start) / 1000)}s`
              : `${r.type}: ${r.reps} reps @ ${r.weight}`}
          </div>
        ))}
      </div>
      <p className="text-center">
        <Link className="text-blue-600" to="/">Back Home</Link>
      </p>
    </div>
  );
}
