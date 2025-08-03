import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BottomNavigation from './BottomNavigation.jsx';

describe('BottomNavigation', () => {
  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <BottomNavigation />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Home/i)).toBeTruthy();
    expect(screen.getByLabelText(/Create/i)).toBeTruthy();
    expect(screen.getByLabelText(/Workouts/i)).toBeTruthy();
    expect(screen.getByLabelText(/Logs/i)).toBeTruthy();
  });
});
