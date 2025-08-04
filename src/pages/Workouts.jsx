import { useNavigate } from 'react-router-dom';
import { useStore } from '../store.jsx';
import { createId } from '../storage.js';
import { Card, Button, Badge } from '../components/ui';
import { Dumbbell, Pencil, Copy, Trash2 } from 'lucide-react';

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
        <Button onClick={() => navigate('/create')}>
          Create your first workout
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      {routines.map(r => (
        <Card key={r.id} className="p-4">
          <div
            className="cursor-pointer"
            onClick={() => navigate(`/workout/${r.id}`)}
          >
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Dumbbell className="w-4 h-4" /> {r.name}
            </h3>
            <Badge variant="secondary" className="mt-1">
              {r.exercises.length} exercise{r.exercises.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/create?id=${r.id}`)}
              aria-label="Edit workout"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => duplicate(r.id)}
              aria-label="Duplicate workout"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => remove(r.id)}
              aria-label="Delete workout"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

