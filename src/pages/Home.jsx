import { useStore } from '../store.jsx';

export default function Home() {
  const { workouts } = useStore();

  const totalWorkouts = workouts.length;
  const totalSets = workouts.reduce((a, w) => a + w.records.length, 0);
  const totalWeight = workouts.reduce(
    (a, w) => a + w.records.reduce((b, r) => b + r.weight * r.reps, 0),
    0
  );

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <h2 className="text-lg font-bold mb-2">Statistics</h2>
        <p>Total Workouts: {totalWorkouts}</p>
        <p>Total Sets: {totalSets}</p>
        <p>Total Weight: {totalWeight}</p>
      </div>
      <p className="text-center">Welcome to RepSmasher! Track your workouts and smash those goals.</p>
    </div>
  );
}
