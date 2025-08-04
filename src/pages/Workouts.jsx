import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store.jsx';

export default function Workouts() {
  const { routines, workouts } = useStore();
  const navigate = useNavigate();

  function onWorkoutCardClick(id) {
    const latest = [...workouts]
      .map((w, i) => ({ w, i }))
      .reverse()
      .find(({ w }) => w.routineId === id);
    if (latest) {
      navigate(`/summary/${latest.i}`);
    } else {
      navigate(`/workout/${id}`);
    }
  }

  function onStartWorkout(id) {
    navigate(`/workout/${id}`);
  }

  function onEditWorkout(id) {
    navigate(`/create?id=${id}`);
  }

  const templates = routines.map(r => {
    const logs = workouts.filter(w => w.routineId === r.id);
    const totalSessions = logs.length;
    const lastPerformed = logs.length ? logs[logs.length - 1].date : null;
    const averageDuration = totalSessions
      ? Math.round(
          logs.reduce((a, w) => a + (w.totalTime || 0), 0) /
            totalSessions /
            60000
        )
      : 0;
    const estimatedCalories = totalSessions
      ? Math.round(
          logs.reduce(
            (a, w) =>
              a +
              w.records.reduce(
                (b, r) => b + r.reps * r.weight * 0.1,
                0
              ),
            0
          ) / totalSessions
        )
      : 0;
    return {
      id: r.id,
      name: r.name,
      lastPerformed,
      totalSessions,
      averageDuration,
      totalExercises: r.exercises.length,
      estimatedCalories,
    };
  }).sort((a, b) => {
    const aDate = a.lastPerformed ? new Date(a.lastPerformed).getTime() : 0;
    const bDate = b.lastPerformed ? new Date(b.lastPerformed).getTime() : 0;
    return bDate - aDate;
  });

  return (
    <div className="flex-1 p-4 pb-20 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            RepSmasher
          </h1>
          <h2 className="text-xl font-semibold text-slate-700 mt-2">My Workouts</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-md flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">🏋️</div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{routines.length}</p>
              <p className="text-sm text-slate-600">Templates</p>
            </div>
          </div>
          <div className="p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-md flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">📅</div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{workouts.length}</p>
              <p className="text-sm text-slate-600">Total Sessions</p>
            </div>
          </div>
        </div>

        {templates.length > 0 ? (
          <div className="space-y-4">
            {templates.map(workout => (
              <div
                key={workout.id}
                className="p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">🏋️</div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{workout.name}</h3>
                        {workout.lastPerformed && (
                          <p className="text-sm text-slate-600">
                            Last: {new Date(workout.lastPerformed).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-700 rounded px-2 py-1 text-xs font-semibold">
                        {workout.totalSessions} sessions
                      </span>
                      <button
                        onClick={() => onEditWorkout(workout.id)}
                        className="p-2 hover:bg-slate-100 rounded-full"
                      >
                        ⋮
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">⏱️</div>
                      <p className="font-semibold text-slate-800">{workout.averageDuration}m</p>
                      <p className="text-slate-600 text-xs">Avg Time</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">🏋️</div>
                      <p className="font-semibold text-slate-800">{workout.totalExercises}</p>
                      <p className="text-slate-600 text-xs">Exercises</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">⚡</div>
                      <p className="font-semibold text-slate-800">{workout.estimatedCalories}</p>
                      <p className="text-slate-600 text-xs">Avg Cals</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onWorkoutCardClick(workout.id)}
                      className="flex-1 border border-slate-200 hover:bg-slate-50 text-sm px-3 py-2 rounded flex items-center justify-center"
                    >
                      <span className="mr-2">👁️</span>View Stats
                    </button>
                    <button
                      onClick={() => onStartWorkout(workout.id)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm px-3 py-2 rounded flex items-center justify-center"
                    >
                      <span className="mr-2">▶</span>Start
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white/80 backdrop-blur-sm rounded-lg shadow-md">
            <div className="text-slate-400 mb-4">🏋️</div>
            <h3 className="font-semibold text-slate-700 mb-2">No Workouts Yet</h3>
            <p className="text-slate-500 text-sm mb-4">
              Create your first workout to get started on your fitness journey.
            </p>
            <Link
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded inline-block"
              to="/create"
            >
              Create Workout
            </Link>
          </div>
        )}

        {templates.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Pro Tip</h3>
              <p className="text-purple-100 text-sm">
                Tap the menu icon (⋮) to edit your workouts.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

