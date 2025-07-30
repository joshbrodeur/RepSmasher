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
    <div className="container">
      <ul className="list">
        {routines.map(r => (
          <li key={r.id}>
            <span onClick={() => navigate(`/workout/${r.id}`)} style={{ cursor: 'pointer' }}>
              {r.name}
            </span>
            <span>
              <Link to={`/create?id=${r.id}`}>Edit</Link>
              <button onClick={() => remove(r.id)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
