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
    <div className="container">
      <h2>Statistics</h2>
      <p>Total Workouts: {totalWorkouts}</p>
      <p>Total Sets: {totalSets}</p>
      <p>Total Weight: {totalWeight}</p>
      <p>Welcome to RepSmasher! Track your workouts and smash those goals.</p>
    </div>
  );
}
