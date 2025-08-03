import { useStore } from '../store.jsx';
import { useNavigate } from 'react-router-dom';
import ActivityGrid from '../components/ActivityGrid.jsx';

export default function Home() {
  const { routines, workouts } = useStore();
  const navigate = useNavigate();

  const totalWorkouts = workouts.length;
  const totalSets = workouts.reduce((a, w) => a + w.records.length, 0);
  const totalWeight = workouts.reduce(
    (a, w) => a + w.records.reduce((b, r) => b + r.weight * r.reps, 0),
    0
  );
  const totalTime = workouts.reduce((a, w) => a + (w.totalTime || 0), 0);
  const averageWorkoutTime = totalWorkouts
    ? Math.round(totalTime / totalWorkouts / 60000)
    : 0;

  const workoutDays = workouts.map(w => w.date.split('T')[0]);

  function calculateCurrentStreak() {
    if (workoutDays.length === 0) return 0;
    const sorted = [...new Set(workoutDays)].sort();
    let streak = 0;
    let current = new Date();
    for (let i = sorted.length - 1; i >= 0; i--) {
      const d = new Date(sorted[i]);
      if (Math.floor((current - d) / 86400000) <= 1) {
        streak++;
        current = d;
      } else {
        break;
      }
    }
    return streak;
  }

  const currentStreak = calculateCurrentStreak();

  const lastWorkout = workouts[workouts.length - 1];
  const lastRoutine = routines.find(r => r.id === lastWorkout?.routineId);

  return (
    <div className="max-w-md mx-auto space-y-4 pb-20">
      {lastWorkout && lastRoutine && (
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Quick Workout</h3>
            <p className="text-purple-100 text-sm">Repeat: {lastRoutine.name}</p>
          </div>
          <button
            className="p-2 bg-white text-purple-600 rounded shadow"
            onClick={() => navigate(`/workout/${lastRoutine.id}`)}
          >
            Start
          </button>
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow space-y-1">
        <h2 className="text-lg font-bold">Statistics</h2>
        <p>Total Workouts: {totalWorkouts}</p>
        <p>Total Sets: {totalSets}</p>
        <p>Total Weight: {totalWeight}</p>
        <p>Avg Minutes: {averageWorkoutTime}</p>
        <p>Day Streak: {currentStreak}</p>
      </div>
      <ActivityGrid days={workoutDays} />
      <p className="text-center">Welcome to RepSmasher! Track your workouts and smash those goals.</p>
    </div>
  );
}
