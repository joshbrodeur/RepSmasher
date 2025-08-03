import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import BottomNavigation from './BottomNavigation.jsx';

afterEach(cleanup);

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

  it('wraps links in a nav element with accessibility attributes', () => {
    render(
      <MemoryRouter>
        <BottomNavigation />
      </MemoryRouter>
    );

    const nav = screen.getByRole('navigation', { name: /bottom navigation/i });
    expect(nav).toBeTruthy();
  });

  it('marks the active link with aria-current', () => {
    render(
      <MemoryRouter initialEntries={["/create"]}>
        <BottomNavigation />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Create/i)).toHaveAttribute('aria-current', 'page');
    expect(screen.getByLabelText(/Home/i)).not.toHaveAttribute('aria-current');
  });
});
