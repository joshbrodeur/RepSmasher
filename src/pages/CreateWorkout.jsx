import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useStore } from '../store.jsx';
import { createId } from '../storage.js';

export default function CreateWorkout() {
  const { routines, setRoutines } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const existing = routines.find(r => r.id === editId);
  const routineId = existing ? existing.id : createId();
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

  function handleDragEnd(result) {
    if (!result.destination) return;
    const list = Array.from(exercises);
    const [item] = list.splice(result.source.index, 1);
    list.splice(result.destination.index, 0, item);
    setExercises(list);
  }

  function saveRoutine() {
    const routine = { id: routineId, name: name || 'Routine', exercises };
    const list = routines.some(r => r.id === routineId)
      ? routines.map(r => r.id === routineId ? routine : r)
      : [...routines, routine];
    try {
      setRoutines(list);
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
  }

  useEffect(() => {
    setSaveStatus('saving');
    const t = setTimeout(saveRoutine, 300);
    return () => clearTimeout(t);
  }, [name, exercises]);

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
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="exercises">
          {(provided) => (
            <ul
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {exercises.map((ex, idx) => (
                <Draggable key={ex.id} draggableId={ex.id} index={idx}>
                  {(prov) => (
                    <li
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
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
