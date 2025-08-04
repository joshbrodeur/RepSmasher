import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Workout from './Workout.jsx';

const future = { v7_startTransition: true, v7_relativeSplatPath: true };

let mockStore;
vi.mock('../store.jsx', () => ({
  useStore: () => mockStore,
}));

beforeEach(() => {
  mockStore = {
    routines: [
      {
        id: 'r1',
        name: 'Test Routine',
        exercises: [{ type: 'Push Ups', reps: 0, weight: 0 }],
      },
    ],
    workouts: [],
    setWorkouts: vi.fn(w => {
      mockStore.workouts = w;
    }),
  };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('Workout page', () => {
  it('saves records and navigates to summary when workout is finished', async () => {
    render(
      <MemoryRouter initialEntries={['/workout/r1']} future={future}>
        <Routes>
          <Route path="/workout/:id" element={<Workout />} />
          <Route path="/summary/:id" element={<div>Summary Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/start workout/i));
    fireEvent.click(screen.getByText(/done/i));

    await screen.findByText(/summary page/i);

    expect(mockStore.workouts).toHaveLength(1);
    expect(mockStore.workouts[0].records[0]).toMatchObject({ type: 'Push Ups' });
  });
});
