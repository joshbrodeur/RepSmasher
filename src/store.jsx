import React, { createContext, useContext, useState, useEffect } from 'react';
import { load, save } from './storage.js';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [routines, setRoutines] = useState(() => load('routines', []));
  const [workouts, setWorkouts] = useState(() => load('workouts', []));
  const [exerciseNames, setExerciseNames] = useState(() => load('exerciseNames', []));

  useEffect(() => save('routines', routines), [routines]);
  useEffect(() => save('workouts', workouts), [workouts]);
  useEffect(() => save('exerciseNames', exerciseNames), [exerciseNames]);

  return (
    <StoreContext.Provider value={{ routines, setRoutines, workouts, setWorkouts, exerciseNames, setExerciseNames }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
