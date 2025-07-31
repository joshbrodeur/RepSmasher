import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useStore } from '../store.jsx';
import Card from '../components/Card.jsx';

export default function Workout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { routines, workouts, setWorkouts } = useStore();
  const routine = routines.find(r => r.id === id);

  const [index, setIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [records, setRecords] = useState([]);
  const [exerciseStart, setExerciseStart] = useState(null);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let t;
    if (startTime) {
      t = setInterval(() => setTimer(Date.now() - startTime), 1000);
    }
    return () => clearInterval(t);
  }, [startTime]);

  function start() {
    setStartTime(Date.now());
    setExerciseStart(Date.now());
  }

  function next(reps = 0, weight = 0) {
    const ex = routine.exercises[index];
    const record = {
      type: ex.type,
      reps,
      weight,
      start: exerciseStart,
      end: Date.now(),
      rest: ex.rest,
    };
    setRecords([...records, record]);
    setExerciseStart(Date.now());
    const nextIndex = index + 1;
    if (nextIndex >= routine.exercises.length) {
      finish([...records, record]);
    } else {
      setIndex(nextIndex);
    }
  }

  function finish(finalRecords) {
    const totalTime = Date.now() - startTime;
    setWorkouts([...workouts, { routineId: routine.id, date: new Date().toISOString(), records: finalRecords, totalTime }]);
    navigate(`/summary/${workouts.length}`);
  }

  if (!routine) return <div className="max-w-md mx-auto">Routine not found.</div>;

  const ex = routine.exercises[index];

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-lg font-bold text-center">{routine.name}</h2>
      {!startTime && (
        <button className="w-full p-2 bg-blue-600 text-white rounded" onClick={start}>
          Start Workout
        </button>
      )}
      {startTime && (
        <Card className="space-y-4">
          <p className="text-center">Time: {(timer / 1000).toFixed(0)}s</p>
          {ex.restSet ? (
            <div className="text-center space-y-2">
              <h3 className="text-xl">Rest - {ex.rest}s</h3>
              <button className="p-2 bg-green-600 text-white rounded" onClick={() => next()}>
                Continue
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-xl text-center">{ex.type}</h3>
              <label className="block">
                Reps
                <input id="reps" className="block w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400" type="number" defaultValue={ex.reps} />
              </label>
              <label className="block">
                Weight
                <input id="weight" className="block w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400" type="number" defaultValue={ex.weight} />
              </label>
              <button
                className="w-full p-2 bg-green-600 text-white rounded"
                onClick={() =>
                  next(
                    parseInt(document.getElementById('reps').value, 10) || 0,
                    parseFloat(document.getElementById('weight').value) || 0
                  )
                }
              >
                Done
              </button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
