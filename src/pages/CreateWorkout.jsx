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
    const type = prompt('Exercise name');
    if (!type) return;
    const reps = parseInt(prompt('Reps', '10'), 10) || 0;
    const weight = parseFloat(prompt('Weight', '0')) || 0;
    setExercises([...exercises, { id: createId(), type, sets:1, reps, weight, rest:0 }]);
  }

  function addRest() {
    const rest = parseInt(prompt('Rest seconds', '30'), 10) || 0;
    setExercises([...exercises, { id: createId(), type:'Rest', sets:1, reps:0, weight:0, rest, restSet:true }]);
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
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center"
                    >
                      <span>
                        {ex.restSet
                          ? `Rest - ${ex.rest}s`
                          : `${ex.type} - ${ex.reps} reps @ ${ex.weight}`}
                      </span>
                      <div className="flex gap-2">
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
