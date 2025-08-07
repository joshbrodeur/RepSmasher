import { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store.jsx';
import { createId } from '../storage.js';

export default function CreateWorkout() {
  const { routines, setRoutines } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const existing = routines.find(r => r.id === editId);
  const routineIdRef = useRef(existing ? existing.id : createId());
  const [name, setName] = useState(existing?.name || '');
  const [exercises, setExercises] = useState(() => existing ? [...existing.exercises] : []);
  const [saveStatus, setSaveStatus] = useState('saved');

  function addExercise() {
    setExercises([
      ...exercises,
      { id: createId(), type: '', sets: 1, reps: 0, weight: 0, rest: 0 }
    ]);
  }

  function addRest() {
    setExercises([
      ...exercises,
      { id: createId(), type: 'Rest', sets: 1, reps: 0, weight: 0, rest: 30, restSet: true }
    ]);
  }

  function updateExercise(index, field, value) {
    const list = [...exercises];
    list[index] = { ...list[index], [field]: value };
    setExercises(list);
  }

  function duplicate(idx) {
    const item = exercises[idx];
    const copy = { ...item, id: createId() };
    const list = [...exercises];
    list.splice(idx + 1, 0, copy);
    setExercises(list);
  }

  function remove(idx) {
    if (!window.confirm('Delete this card?')) return;
    setExercises(exercises.filter((_, i) => i !== idx));
  }

  const [dragIndex, setDragIndex] = useState(null);

  function handleDragStart(index) {
    setDragIndex(index);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(index) {
    if (dragIndex === null || dragIndex === index) return;
    const list = Array.from(exercises);
    const [item] = list.splice(dragIndex, 1);
    list.splice(index, 0, item);
    setDragIndex(null);
    setExercises(list);
  }

  const saveRoutine = useCallback(() => {
    const routine = { id: routineIdRef.current, name: name || 'Routine', exercises };
    try {
      setRoutines(prev => {
        const list = prev.some(r => r.id === routineIdRef.current)
          ? prev.map(r => (r.id === routineIdRef.current ? routine : r))
          : [...prev, routine];
        return list;
      });
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
  }, [name, exercises, setRoutines]);

  useEffect(() => {
    setSaveStatus('saving');
    const t = setTimeout(saveRoutine, 300);
    return () => clearTimeout(t);
  }, [saveRoutine]);

  function deleteRoutine() {
    if (existing) {
      setRoutines(routines.filter(r => r.id !== existing.id));
      navigate('/');
    }
  }

  function handleDone() {
    saveRoutine();
    navigate('/');
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
            key={ex.id}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(idx)}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-2"
          >
            {ex.restSet ? (
              <div>
                <label className="block text-sm mb-1">Rest (sec)</label>
                <input
                  type="number"
                            className="w-full p-2 rounded border dark:bg-gray-700"
                            value={ex.rest}
                            onChange={e => updateExercise(idx, 'rest', parseInt(e.target.value, 10) || 0)}
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <input
                            className="w-full p-2 rounded border dark:bg-gray-700"
                            placeholder="Exercise"
                            value={ex.type}
                            onChange={e => updateExercise(idx, 'type', e.target.value)}
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="number"
                              className="w-full p-2 rounded border dark:bg-gray-700"
                              placeholder="Sets"
                              value={ex.sets}
                              onChange={e => updateExercise(idx, 'sets', parseInt(e.target.value, 10) || 0)}
                            />
                            <input
                              type="number"
                              className="w-full p-2 rounded border dark:bg-gray-700"
                              placeholder="Reps"
                              value={ex.reps}
                              onChange={e => updateExercise(idx, 'reps', parseInt(e.target.value, 10) || 0)}
                            />
                            <input
                              type="number"
                              className="w-full p-2 rounded border dark:bg-gray-700"
                              placeholder="Weight"
                              value={ex.weight}
                              onChange={e => updateExercise(idx, 'weight', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                      )}
            <div className="flex gap-2 justify-end">
              <button className="text-blue-500" onClick={() => duplicate(idx)}>
                Duplicate
              </button>
              <button className="text-red-500" onClick={() => remove(idx)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="text-sm text-center text-gray-500">
        {saveStatus === 'saving'
          ? 'Saving...'
          : saveStatus === 'error'
          ? 'Save failed'
          : 'All changes saved'}
      </div>
      <div className="flex gap-2">
        <button className="flex-1 p-2 bg-green-600 text-white rounded" onClick={handleDone}>
          Done
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
