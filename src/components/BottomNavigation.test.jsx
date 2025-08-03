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

  const routes = [
    { path: '/', label: /Home/i },
    { path: '/create', label: /Create/i },
    { path: '/workouts', label: /Workouts/i },
    { path: '/logs', label: /Logs/i },
  ];

  it.each(routes)('marks %s link as active', ({ path, label }) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <BottomNavigation />
      </MemoryRouter>
    );

    const activeLink = screen.getByLabelText(label);
    expect(activeLink).toHaveAttribute('aria-current', 'page');
    expect(activeLink).toHaveClass('text-blue-600');
  });
});
