import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store.js';
import { createId } from '../storage.js';

export default function CreateWorkout() {
  const { routines, setRoutines } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const existing = routines.find(r => r.id === editId);
  const [name, setName] = useState(existing?.name || '');
  const [exercises, setExercises] = useState(() => existing ? [...existing.exercises] : []);

  function addExercise() {
    const type = prompt('Exercise name');
    if (!type) return;
    const reps = parseInt(prompt('Reps', '10'), 10) || 0;
    const weight = parseFloat(prompt('Weight', '0')) || 0;
    setExercises([...exercises, { type, sets:1, reps, weight, rest:0 }]);
  }

  function addRest() {
    const rest = parseInt(prompt('Rest seconds', '30'), 10) || 0;
    setExercises([...exercises, { type:'Rest', sets:1, reps:0, weight:0, rest, restSet:true }]);
  }

  function remove(idx) {
    setExercises(exercises.filter((_, i) => i !== idx));
  }

  function saveRoutine() {
    const routine = { id: existing ? existing.id : createId(), name: name || 'Routine', exercises };
    const list = existing ? routines.map(r => r.id === routine.id ? routine : r) : [...routines, routine];
    setRoutines(list);
    navigate('/');
  }

  function deleteRoutine() {
    if (existing) {
      setRoutines(routines.filter(r => r.id !== existing.id));
      navigate('/');
    }
  }

  return (
    <div className="container">
      <h2>{existing ? 'Edit Workout' : 'Create Workout'}</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Workout name" />
      <div>
        <button onClick={addExercise}>Add Exercise</button>
        <button onClick={addRest}>Add Rest</button>
      </div>
      <ul className="list">
        {exercises.map((ex, idx) => (
          <li key={idx}>
            {ex.restSet ? `Rest - ${ex.rest}s` : `${ex.type} - ${ex.reps} reps @ ${ex.weight}`}
            <button onClick={() => remove(idx)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={saveRoutine}>Save</button>
      {existing && <button onClick={deleteRoutine}>Delete</button>}
    </div>
  );
}
