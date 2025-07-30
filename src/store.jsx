import React, { createContext, useContext, useState, useEffect } from 'react';
import { load, save } from './storage.js';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [routines, setRoutines] = useState(() => load('routines', []));
  const [workouts, setWorkouts] = useState(() => load('workouts', []));

  useEffect(() => save('routines', routines), [routines]);
  useEffect(() => save('workouts', workouts), [workouts]);

  return (
    <StoreContext.Provider value={{ routines, setRoutines, workouts, setWorkouts }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
