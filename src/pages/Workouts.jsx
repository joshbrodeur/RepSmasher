import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store.jsx';
import { createId } from '../storage.js';

export default function Workouts() {
  const { routines, setRoutines } = useStore();
  const navigate = useNavigate();

  function remove(id) {
    if (confirm('Delete this routine?')) {
      setRoutines(routines.filter(r => r.id !== id));
    }
  }

  function duplicate(id) {
    const routine = routines.find(r => r.id === id);
    if (!routine) return;
    const copy = {
      ...routine,
      id: createId(),
      name: routine.name + ' Copy',
      exercises: routine.exercises.map(ex => ({ ...ex, id: createId() })),
    };
    setRoutines([...routines, copy]);
  }

  if (routines.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center">
        <p className="text-gray-500 mb-4">No workouts saved.</p>
        <Link className="text-blue-600" to="/create">Create your first workout</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      {routines.map(r => (
        <div
          key={r.id}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
        >
          <div
            className="cursor-pointer"
            onClick={() => navigate(`/workout/${r.id}`)}
          >
            <h3 className="text-lg font-bold">{r.name}</h3>
            <p className="text-sm text-gray-500">
              {r.exercises.length} exercise{r.exercises.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex justify-end gap-4 mt-4 text-sm">
            <Link className="text-blue-600" to={`/create?id=${r.id}`}>Edit</Link>
            <button className="text-blue-600" onClick={() => duplicate(r.id)}>Duplicate</button>
            <button className="text-red-500" onClick={() => remove(r.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

