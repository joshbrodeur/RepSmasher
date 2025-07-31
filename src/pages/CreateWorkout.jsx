import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store.jsx';
import { createId } from '../storage.js';

export default function CreateWorkout() {
  const { routines, setRoutines } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const existing = routines.find(r => r.id === editId);
  const [name, setName] = useState(existing?.name || '');
  const [exercises, setExercises] = useState(() => existing ? [...existing.exercises] : []);
  const [dragIndex, setDragIndex] = useState(null);

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

  function handleDragStart(idx) {
    setDragIndex(idx);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(idx) {
    if (dragIndex === null || dragIndex === idx) return;
    const list = [...exercises];
    const [item] = list.splice(dragIndex, 1);
    list.splice(idx, 0, item);
    setExercises(list);
    setDragIndex(null);
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
    <div className="max-w-md mx-auto space-y-4 pb-20">
      <h2 className="text-lg font-bold text-center">
        {existing ? 'Edit Workout' : 'Create Workout'}
      </h2>
      <input
        className="w-full p-2 rounded border dark:bg-gray-700"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Workout name"
      />
      <div className="flex gap-2">
        <button className="flex-1 p-2 bg-blue-600 text-white rounded" onClick={addExercise}>
          Add Exercise
        </button>
        <button className="flex-1 p-2 bg-blue-600 text-white rounded" onClick={addRest}>
          Add Rest
        </button>
      </div>
      <ul className="space-y-2">
        {exercises.map((ex, idx) => (
          <li
            key={idx}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(idx)}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center cursor-move"
          >
            <span>
              {ex.restSet
                ? `Rest - ${ex.rest}s`
                : `${ex.type} - ${ex.reps} reps @ ${ex.weight}`}
            </span>
            <button className="text-red-500" onClick={() => remove(idx)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <button className="flex-1 p-2 bg-green-600 text-white rounded" onClick={saveRoutine}>
          Save
        </button>
        {existing && (
          <button className="flex-1 p-2 bg-red-600 text-white rounded" onClick={deleteRoutine}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
