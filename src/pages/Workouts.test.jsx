import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import Workouts from './Workouts.jsx';

const future = { v7_startTransition: true, v7_relativeSplatPath: true };

let mockStore;
vi.mock('../store.jsx', () => ({
  useStore: () => mockStore,
}));

beforeEach(() => {
  vi.useFakeTimers();
  mockStore = {
    routines: [
      {
        id: 'r1',
        name: 'Test Routine',
        exercises: [{ type: 'Push Ups', reps: 0, weight: 0, id: 'e1' }],
      },
    ],
    workouts: [],
    setRoutines: vi.fn(fn => {
      mockStore.routines = typeof fn === 'function' ? fn(mockStore.routines) : fn;
    }),
  };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe('Workouts page', () => {
  it('only duplicates once on rapid clicks', () => {
    render(
      <MemoryRouter future={future}>
        <Workouts />
      </MemoryRouter>
    );

    const dupBtn = screen.getByLabelText(/duplicate workout/i);

    fireEvent.click(dupBtn);
    fireEvent.click(dupBtn);

    vi.runAllTimers();

    expect(mockStore.routines).toHaveLength(2);
  });
});
