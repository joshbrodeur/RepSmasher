import { useNavigate } from 'react-router-dom';
import { useStore } from '../store.jsx';
import { createId } from '../storage.js';
import { Card, Button } from '../components/ui';
import {
  Dumbbell,
  Pencil,
  Copy,
  Trash2,
  Play,
  Eye,
  Clock,
  Hash,
} from 'lucide-react';

export default function Workouts() {
  const { routines, setRoutines, workouts } = useStore();
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
      <h1 className="text-2xl font-bold text-center">Workouts</h1>
      {routines.map(r => {
        const stats = workouts
          .filter(w => w.routineId === r.id)
          .reduce(
            (acc, w) => {
              acc.sessions += 1;
              acc.totalTime += w.totalTime;
              acc.lastDate =
                !acc.lastDate || new Date(w.date) > new Date(acc.lastDate)
                  ? w.date
                  : acc.lastDate;
              return acc;
            },
            { sessions: 0, totalTime: 0, lastDate: null }
          );
        const avgTime = stats.sessions
          ? Math.round(stats.totalTime / stats.sessions / 60000)
          : 0;
        const lastDate = stats.lastDate
          ? new Date(stats.lastDate).toLocaleDateString()
          : 'Never';

        return (
          <Card key={r.id} className="p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" /> {r.name}
                </h3>
                <p className="text-sm text-gray-500">Last: {lastDate}</p>
              </div>
              <div className="flex gap-2">
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
            </div>

            <div className="grid grid-cols-3 text-center text-sm">
              <div>
                <div className="flex justify-center mb-1">
                  <Clock className="w-4 h-4 text-slate-600" />
                </div>
                <p className="font-semibold">{avgTime}m</p>
                <p className="text-xs text-gray-500">Avg Time</p>
              </div>
              <div>
                <div className="flex justify-center mb-1">
                  <Dumbbell className="w-4 h-4 text-slate-600" />
                </div>
                <p className="font-semibold">{r.exercises.length}</p>
                <p className="text-xs text-gray-500">Exercises</p>
              </div>
              <div>
                <div className="flex justify-center mb-1">
                  <Hash className="w-4 h-4 text-slate-600" />
                </div>
                <p className="font-semibold">{stats.sessions}</p>
                <p className="text-xs text-gray-500">Sessions</p>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/logs?routine=${r.id}`)}
              >
                <Eye className="w-4 h-4 mr-2" /> View Stats
              </Button>
              <Button
                size="sm"
                onClick={() => navigate(`/workout/${r.id}`)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Play className="w-4 h-4 mr-2" /> Start
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

