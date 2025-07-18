import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useStore } from '../store.js';

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

  if (!routine) return <div className="container">Routine not found.</div>;

  const ex = routine.exercises[index];

  return (
    <div className="container">
      <h2>{routine.name}</h2>
      {!startTime && <button onClick={start}>Start Workout</button>}
      {startTime && (
        <>
          <p>Time: {(timer / 1000).toFixed(0)}s</p>
          {ex.restSet ? (
            <div>
              <h3>Rest - {ex.rest}s</h3>
              <button onClick={() => next()}>Continue</button>
            </div>
          ) : (
            <div>
              <h3>{ex.type}</h3>
              <label>
                Reps <input id="reps" type="number" defaultValue={ex.reps} />
              </label>
              <label>
                Weight <input id="weight" type="number" defaultValue={ex.weight} />
              </label>
              <button onClick={() => next(parseInt(document.getElementById('reps').value, 10) || 0,
                                        parseFloat(document.getElementById('weight').value) || 0)}>
                Done
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
