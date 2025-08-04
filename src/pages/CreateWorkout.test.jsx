import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CreateWorkout from './CreateWorkout.jsx';

const future = { v7_startTransition: true, v7_relativeSplatPath: true };

let mockStore;
vi.mock('../store.jsx', () => ({
  useStore: () => mockStore,
}));

beforeEach(() => {
  vi.useFakeTimers();
  mockStore = {
    routines: [],
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

describe('CreateWorkout page', () => {
  it('autosaves changes and navigates home on done', async () => {
    render(
      <MemoryRouter initialEntries={['/create']} future={future}>
        <Routes>
          <Route path="/create" element={<CreateWorkout />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/workout name/i), {
      target: { value: 'Leg Day' },
    });

    await act(async () => {
      vi.runAllTimers();
    });

    expect(mockStore.routines).toHaveLength(1);
    expect(mockStore.routines[0]).toMatchObject({ name: 'Leg Day' });

    await act(async () => {
      fireEvent.click(screen.getByText(/done/i));
    });

    expect(screen.getByText(/home page/i)).toBeInTheDocument();
  });
});
