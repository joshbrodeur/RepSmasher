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
  mockStore = {
    routines: [],
    setRoutines: vi.fn(fn => {
      mockStore.routines = typeof fn === 'function' ? fn(mockStore.routines) : fn;
    }),
    exerciseNames: [],
    setExerciseNames: vi.fn(fn => {
      mockStore.exerciseNames = typeof fn === 'function' ? fn(mockStore.exerciseNames) : fn;
    }),
  };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('CreateWorkout page', () => {
  it('prompts for name, saves on done, and navigates home', async () => {
    const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue('Leg Day');

    render(
      <MemoryRouter initialEntries={['/create']} future={future}>
        <Routes>
          <Route path="/create" element={<CreateWorkout />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(mockStore.routines).toHaveLength(0);

    await act(async () => {
      fireEvent.click(screen.getByText(/done/i));
    });

    expect(promptSpy).toHaveBeenCalled();
    expect(mockStore.routines).toHaveLength(1);
    expect(mockStore.routines[0]).toMatchObject({ name: 'Leg Day' });
    expect(screen.getByText(/home page/i)).toBeInTheDocument();
  });

  it('does not save until done is pressed', async () => {
    render(
      <MemoryRouter initialEntries={['/create']} future={future}>
        <Routes>
          <Route path="/create" element={<CreateWorkout />} />
          <Route path="/" element={<div />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/add exercise/i));
    expect(mockStore.routines).toHaveLength(0);

    vi.spyOn(window, 'prompt').mockReturnValue('Leg Day');

    await act(async () => {
      fireEvent.click(screen.getByText(/done/i));
    });

    expect(mockStore.routines).toHaveLength(1);
    expect(mockStore.routines[0]).toMatchObject({ name: 'Leg Day' });
  });

  it('stores exercise names for autocomplete', async () => {
    render(
      <MemoryRouter initialEntries={['/create']} future={future}>
        <Routes>
          <Route path="/create" element={<CreateWorkout />} />
          <Route path="/" element={<div />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/add exercise/i));
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Push Ups' } });

    vi.spyOn(window, 'prompt').mockReturnValue('Chest Day');
    await act(async () => {
      fireEvent.click(screen.getByText(/done/i));
    });

    expect(mockStore.exerciseNames).toContain('Push Ups');
  });
});
