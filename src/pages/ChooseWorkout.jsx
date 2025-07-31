import { useStore } from '../store.jsx';
import { Link, useNavigate } from 'react-router-dom';

export default function ChooseWorkout() {
  const { routines, setRoutines } = useStore();
  const navigate = useNavigate();

  function remove(id) {
    if (confirm('Delete this routine?')) {
      setRoutines(routines.filter(r => r.id !== id));
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <ul className="space-y-2">
        {routines.map(r => (
          <li key={r.id} className="bg-white dark:bg-gray-800 p-3 rounded shadow flex justify-between">
            <span onClick={() => navigate(`/workout/${r.id}`)} className="cursor-pointer">
              {r.name}
            </span>
            <span className="flex gap-2">
              <Link className="text-blue-600" to={`/create?id=${r.id}`}>Edit</Link>
              <button className="text-red-500" onClick={() => remove(r.id)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
