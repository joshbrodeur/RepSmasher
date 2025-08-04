import { useStore } from '../store.jsx';

export default function Workouts() {
  const { workouts, routines } = useStore();

  function getUniqueWorkouts() {
    const map = new Map();
    workouts.forEach(w => {
      const routine = routines.find(r => r.id === w.routineId);
      const name = routine ? routine.name : 'Workout';
      const duration = Math.round((w.totalTime || 0) / 60000);
      const exerciseCount = new Set(
        w.records.filter(r => r.type !== 'Rest').map(r => r.type)
      ).size;
      const calories = Math.round(
        w.records.reduce((sum, r) => sum + r.reps * (r.weight || 1) * 0.1, 0)
      );
      const existing = map.get(name);
      if (!existing) {
        map.set(name, {
          name,
          lastPerformed: w.date,
          totalSessions: 1,
          averageDuration: duration,
          exerciseCount,
          estimatedCalories: calories,
        });
      } else {
        map.set(name, {
          name,
          lastPerformed:
            new Date(w.date) > new Date(existing.lastPerformed)
              ? w.date
              : existing.lastPerformed,
          totalSessions: existing.totalSessions + 1,
          averageDuration: Math.round(
            (existing.averageDuration * existing.totalSessions + duration) /
              (existing.totalSessions + 1)
          ),
          exerciseCount,
          estimatedCalories: Math.round(
            (existing.estimatedCalories * existing.totalSessions + calories) /
              (existing.totalSessions + 1)
          ),
        });
      }
    });
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.lastPerformed) - new Date(a.lastPerformed)
    );
  }

  const uniqueWorkouts = getUniqueWorkouts();
  const totalSessions = uniqueWorkouts.reduce(
    (sum, w) => sum + w.totalSessions,
    0
  );

  if (uniqueWorkouts.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center">
        <p className="text-gray-500 mb-4">No workouts logged.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4 pb-20">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
          <p className="text-lg font-bold">{uniqueWorkouts.length}</p>
          <p className="text-sm text-gray-500">Workouts</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
          <p className="text-lg font-bold">{totalSessions}</p>
          <p className="text-sm text-gray-500">Total Sessions</p>
        </div>
      </div>
      <ul className="space-y-4">
        {uniqueWorkouts.map(w => (
          <li
            key={w.name}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <h3 className="text-lg font-bold">{w.name}</h3>
            <p className="text-sm text-gray-500">
              Last: {new Date(w.lastPerformed).toLocaleDateString()}
            </p>
            <div className="grid grid-cols-4 gap-2 text-center mt-2 text-sm">
              <div>
                <p className="font-semibold">{w.totalSessions}</p>
                <p className="text-gray-500">Sessions</p>
              </div>
              <div>
                <p className="font-semibold">{w.averageDuration}m</p>
                <p className="text-gray-500">Avg Time</p>
              </div>
              <div>
                <p className="font-semibold">{w.exerciseCount}</p>
                <p className="text-gray-500">Exercises</p>
              </div>
              <div>
                <p className="font-semibold">{w.estimatedCalories}</p>
                <p className="text-gray-500">Est Cals</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

