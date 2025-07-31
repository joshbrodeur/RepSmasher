import { useStore } from '../store.jsx';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card.jsx';

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
          <Card as="li" key={r.id} className="flex justify-between py-3">
            <span onClick={() => navigate(`/workout/${r.id}`)} className="cursor-pointer">
              {r.name}
            </span>
            <span className="flex gap-2">
              <Link className="text-blue-600" to={`/create?id=${r.id}`}>Edit</Link>
              <button className="text-red-500" onClick={() => remove(r.id)}>Delete</button>
            </span>
          </Card>
        ))}
      </ul>
    </div>
  );
}
